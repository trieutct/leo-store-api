import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';
import { SuccessResponse } from './utils/api.response';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  getHello() {
    return new SuccessResponse({ id: 1 }, this.i18n.t('test.HELLO'));
  }
}
