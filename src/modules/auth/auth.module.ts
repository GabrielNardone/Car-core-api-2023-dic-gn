import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AUTH_PROVIDER_SERVICE } from './application/interface/auth-provider.service.interface';
import { AuthService } from './application/service/auth.service';
import { AwsCognitoService } from './infrastructure/cognito/aws-cognito.service';
import { JwtStrategy } from './infrastructure/passport/jwt.strategy';
import { AuthController } from './interface/auth.controller';
import { GlobalAuthGuard } from './interface/guard/auth.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE,
      useClass: AwsCognitoService,
    },
    {
      provide: 'APP_GUARD',
      useExisting: GlobalAuthGuard,
    },
    GlobalAuthGuard,
    AuthService,
    JwtStrategy,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
