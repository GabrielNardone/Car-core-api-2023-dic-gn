import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AUTH_PROVIDER_SERVICE } from './application/interfaces/auth-provider.service.interface';
import { AuthService } from './application/service/auth.service';
import { AwsCognitoService } from './application/service/aws-cognito.service';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { AuthController } from './interface/auth.controller';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_PROVIDER_SERVICE,
      useClass: AwsCognitoService,
    },
    AuthService,
    JwtStrategy,
  ],
})
export class AuthModule {}
