import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { UsersModule } from './users/users.module';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpExceptionFilter } from './common/filters/exceptions.filter';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] },
        new HeaderResolver(['x-custom-lang']),
      ],
    }),
    UsersModule,

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: 'APP_FILTER',
      scope: 2,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
