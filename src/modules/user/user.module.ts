import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentModule } from '../document/document.module';
import { UserMapper } from './application/mapper/user.mapper';
import { USER_REPOSITORY } from './application/repository/user.repository.interface';
import { UserService } from './application/service/user.service';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserController } from './interface/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema]), DocumentModule],

  controllers: [UserController],

  providers: [
    UserService,
    UserMapper,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],

  exports: [USER_REPOSITORY, UserService],
})
export class UserModule {}
