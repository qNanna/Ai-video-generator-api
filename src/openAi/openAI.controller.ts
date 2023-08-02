import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { IOpenAiService } from './openAi.service';
import { AnswerRequestDto } from './dto/answer-request.dto';
import { AuthGuard } from '../enchancers/guards/auth.guard';

// type AnswerRequest = { text: string; };

@ApiTags('OpenAI')
@ApiBearerAuth('access-token')
@Controller('v1/openAi')
export class OpenAiController {
  constructor(@Inject('IOpenAiService') private readonly openAiService: IOpenAiService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ description: 'Generate video with prepeared text.', summary: 'Optional' })
  async askOpenAi(@Body() { text }: AnswerRequestDto) {
    return await this.openAiService.createCompetition(text);
  }
}
