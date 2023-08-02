import { Controller, Post, Body, Inject, Delete, Param, Get, Patch, HttpException, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import { isEmpty } from 'lodash';

import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserService } from './user.service';
import { AuthGuard } from '../enchancers/guards/auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('User')
@Controller('v1/user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService
  ) { }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async findUser(@Param('id') id: string) {
    const response = await this.userService.findUserById(id);
    Reflect.deleteProperty(response, 'password');

    return response;
  }

  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    const { userName } = userDto;
    const isUserNameExist = await this.userService.findOneBy({ userName });
    if (isUserNameExist) throw new HttpException({ message: "User already exist!" }, 403);

    return await this.userService.createUser(userDto);
  }

  @Patch('approve-email/:token')
  async approveRegister(@Param('token') token: string) {
    try {
      return await this.userService.approveRegister(token);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  @ApiExcludeEndpoint()
  @ApiOperation({ description: 'BE CAREFUL WITH THIS ENDPOINT, ONLY FOR DEV TEST!!!', summary: "DEV" })
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @Post('signIn')
  async signIn(@Body() userLoginDto: UserDto) {
    userLoginDto.userName = userLoginDto.userName.toLowerCase();

    return await this.userService.signIn(userLoginDto);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async updateUser(@Body() data: UpdateUserDto, @Req() req: Request) {
    const userId = req['user'].id;

    if (isEmpty(data))
      throw new HttpException({ message: "Can't update, no data!" }, HttpStatus.BAD_REQUEST);

    if (data.userName)
      data.userName = data.userName.toLowerCase();

    await this.userService.update(data, userId);

    return await this.userService.findUserById(userId);
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('access-token')
  async changePassword(@Req() req: Request, @Body() data: ChangePasswordDto) {
    const user: UserEntity = req['user'];

    if (user.password !== data.currentPassword)
      throw new HttpException({ message: "Current password is wrong!" }, HttpStatus.FORBIDDEN);

    return await this.userService.update({ password: data.password }, user.id)
  }

  @Post('forgot-password')
  @ApiBody({ examples: { 1: { value: { email: "thomas@gmail.com" } } }, description: 'You can change email manually.' })
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const { email, callbackURL } = data;
    try {
      const user = await this.userService.findOneBy({ userName: email.toLowerCase() });
      if (!user) throw new HttpException({ message: "Email doesn't exist!" }, HttpStatus.FORBIDDEN);
      Reflect.deleteProperty(user, 'password');

      return await this.userService.sendResetMail(email, user, callbackURL);
    } catch (error) {
      throw new HttpException({ message: String(error) }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return await this.userService.resetPassword(data);
  }
}
