import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { PersonModule } from './person/person.module';
import { FriendModule } from './friend/friend.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import { BankTransactionModule } from './bank-transaction/bank-transaction.module';
import { ProcessModule } from './process/process.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    PersonModule,
    FriendModule,
    BankAccountModule,
    BankTransactionModule,
    ProcessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
