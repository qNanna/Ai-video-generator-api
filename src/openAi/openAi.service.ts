import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Configuration, OpenAIApi } from "openai";


@Injectable()
export class OpenAiService implements IOpenAiService {
  private openAiDefaultModel: string;
  private openAiOrganizationId: string;
  private openAiKey: string;
  private openAi: OpenAIApi;

  constructor(private readonly configService: ConfigService) {
    this.openAiDefaultModel = "text-davinci-003";
    this.openAiOrganizationId = this.configService.get<string>('OPENAI_ORGANIZATION_ID');
    this.openAiKey = this.configService.get<string>('OPENAI_API_KEY');

    this.openAi = new OpenAIApi(
      new Configuration({
        organization: this.openAiOrganizationId,
        apiKey: this.openAiKey,
      })
    );
  }

  async createCompetition(text: string, duration: number = 1) {
    const completion = await this.openAi.createCompletion({
      model: this.openAiDefaultModel,
      prompt: text + ` Give answer in ${140 * duration}.`,
      max_tokens: 2048
    });

    const [result] = completion.data.choices;

    return result.text?.replace(/(\r\n|\n|\r)/gm, '');
  }

  async testCompetition() {
    const completion = await this.openAi.createCompletion({
      model: this.openAiDefaultModel,
      prompt: "Tell me about quantum mechanic.",
      max_tokens: 2048
    });

    console.log(completion.data.choices[0].text)
  }
}

export interface IOpenAiService {
  createCompetition(text: string, duration?: number): Promise<string>;
  testCompetition(): Promise<void>;
}
