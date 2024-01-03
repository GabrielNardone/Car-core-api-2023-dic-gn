import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@/common/common.module';

import { USER_REPOSITORY } from './application/repository/user.interface.repository';
import { UserService } from './application/service/user.service';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserController } from './interface/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema]), CommonModule],

  controllers: [UserController],

  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
