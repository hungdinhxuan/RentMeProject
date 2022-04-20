import { RedisService } from './redis.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AppGateway } from './app.gateway';
import { CloudinaryService } from './cloudinary.service';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';
import { GamesModule } from './games/games.module';


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
    TransfersModule,
    ServicesModule,
    CategoriesModule,
    GamesModule
  ],
  controllers: [MailController],
  providers: [
    AppService,
    SendgridService,
    RedisService,
    AppGateway,
    CloudinaryService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(UsersController);
  }
}
