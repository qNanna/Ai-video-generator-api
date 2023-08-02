import { Controller, Post, Body, UseGuards, Param, Inject, Req, HttpException, HttpStatus, Get, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { Request, Response } from 'express';

import { AuthGuard } from '../enchancers/guards/auth.guard';
import { IStripeService } from './stripe.service';
import { IUserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { ChargeDto } from './dto/charge.dto';
import { SocketsGateway } from '../sockets/sockets.gateway';

@ApiTags('Stripe')
@Controller('v1/stripe')
export class StripeController {
  private readonly costForMinute: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly socketsGateway: SocketsGateway,
    @Inject('IStripeService') private readonly stripeService: IStripeService
  ) {
    this.costForMinute = this.configService.get<number>('USD_COST_FOR_ONE_MINUTE');
  }

  @Get('user')
  @UseGuards(AuthGuard)
  @ApiExcludeEndpoint()
  @ApiBearerAuth('access-token')
  async getInfo(@Req() req: Request) {
    const user: IUserEntity = req['user'];

    return await this.stripeService.getInfo(user.stripeId);
  }

  @Get('prices')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async getPrices() {
    return await this.stripeService.getPrices();
  }

  @Get('prices/custom')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiExcludeEndpoint()
  async getCustomPrices(@Req() req: Request) {
    const userId = req['user'].id;

    return await this.stripeService.getCustomPrices(userId);
  }

  @Post('charge')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async charge(@Body() data: ChargeDto, @Req() req: Request) {
    const user: IUserEntity = req['user'];

    const price = await this.stripeService.retrievePrice(data.priceId);
    if (!price)
      throw new HttpException({ message: "Price not exist!" }, HttpStatus.BAD_REQUEST);

    return await this.stripeService.charge(user, { ...data, priceId: price.id });
  }

  @Get('test')
  @ApiOperation({ summary: 'DEV ONLY!', description: 'DEV ONLY!' })
  async test() {
    return await this.stripeService.test();
  }

  // * Stripe webhook
  // * ---------------------------------------------------------------------------
  @Post('REMOVED')
  @ApiExcludeEndpoint()
  async successWebhook(@Body('data') requestData: any, @Res() res: Response) {
    const { object: data } = requestData;

    console.log('\x1b[32m%s\x1b[0m', `Stripe completed webhook: ${data.id}`);
    res.status(200).send(true); // Send for reject trigger endpoint again.

    // REMOVED
  }
  // * ---------------------------------------------------------------------------
}
