import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserMapper } from './application/mapper/user.mapper';
import { USER_REPOSITORY } from './application/repository/user.interface.repository';
import { UserService } from './application/service/user.service';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserController } from './interface/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],

  controllers: [UserController],

  providers: [
    UserService,
    UserMapper,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],

  exports: [USER_REPOSITORY],
})
export class UserModule {}
