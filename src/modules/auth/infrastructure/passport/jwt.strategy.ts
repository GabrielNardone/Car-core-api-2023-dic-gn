import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '@/modules/user/application/service/user.service';

export interface ICognitoToken {
  sub: string;
  iss: string;
  client_id: string;
  origin_jti: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  username: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    const jwtStrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      _audience: configService.get('cognito.clientId'),
      issuer: configService.get('cognito.authority'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configService.get(
          'cognito.authority',
        )}/.well-known/jwks.json`,
      }),
    };

    super(jwtStrategyOptions);
  }

  async validate(accessToken: ICognitoToken) {
    return await this.userService.findOneByExternalId(accessToken.sub);
  }
}
