import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { MessagesModule } from './messages/messages.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TradingsModule } from './tradings/tradings.module';
import { TransfersModule } from './transfers/transfers.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersController } from './users/users.controller';
import { MailController } from './mail.controller';
import { SendgridService } from './sendgrid.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    ConfigModule,
    PlayersModule,
    MessagesModule,
    TransactionsModule,
    TradingsModule,
    TransfersModule
  ],
  controllers: [AppController, MailController],
  providers: [
    AppService,
    SendgridService
  ],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController);
  }
}
