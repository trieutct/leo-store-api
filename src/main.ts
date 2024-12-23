import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigKey } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get(ConfigKey.PORT) || 8080;

  app.setGlobalPrefix('api/v1', { exclude: [''] });
  await app.listen(port);
  console.log(`http://localhost:${port}`);
}
bootstrap();
