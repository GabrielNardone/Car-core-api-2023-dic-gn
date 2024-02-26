import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from '../user/user.module';
import { AUTH_PROVIDER_SERVICE } from './application/interface/auth-provider.service.interface';
import { AuthService } from './application/service/auth.service';
import { AwsCognitoService } from './infrastructure/cognito/aws-cognito.service';
import { JwtStrategy } from './infrastructure/passport/jwt.strategy';
import { AuthController } from './interface/auth.controller';
import { GlobalAuthGuard } from './interface/guard/auth.guard';
import { RoleGuard } from './interface/guard/roles.guard';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE,
      useClass: AwsCognitoService,
    },
    {
      provide: APP_GUARD,
      useExisting: GlobalAuthGuard,
    },
    {
      provide: APP_GUARD,
      useExisting: RoleGuard,
    },
    GlobalAuthGuard,
    RoleGuard,
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
