import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountService } from './account/account.service';
import { LoggerModule } from './logger/logger.module';

import { TypeOrmModule } from '@nestjs/typeorm';

import * as config from 'config';
import { User, Profile, FinancialData, TasksData, Attention } from './account/entities';
import { CryptoUtil } from './utils/crypto.util';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { Posts, Comments, Likes, Views } from './post/entities';
import { NotaddGrpcClientFactory } from './grpc/grpc.client-factory';
import { BlockChainService } from './task/blockchain.service';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { Task } from './task/entities';
import { ConfigModule } from './config/config.module';
import { ActionsHelperService } from './chain/actionsHelper.service';
import { ChainService } from './chain/chain.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.get<string>('db.host'),
      port: config.get<number>('db.port'),
      username: config.get<string>('db.username'),
      password: config.get<string>('db.password'),
      database: config.get<string>('db.database'),
      entities: [
        User,
        Posts, Comments, Likes, Views,
        Task,
        Profile, FinancialData, TasksData, 
        Attention
      ],
      logger: 'advanced-console',
      logging: true,
      synchronize: config.get<boolean>('db.synchronize'),
    }),
    TypeOrmModule.forFeature([
      User,
      Posts, Comments, Likes, Views,
      Task,
      Profile, FinancialData, TasksData, Attention
    ]),
    LoggerModule,
    ConfigModule
  ],
  controllers: [AppController, AccountController, PostController, TaskController],
  providers: [
    AppService, CryptoUtil, AccountService, PostService, 
    TaskService, BlockChainService,
    NotaddGrpcClientFactory,
    ChainService,
    ActionsHelperService,
  ],
})
export class AppModule {}
