import {
  AuthenticationResultType,
  CodeDeliveryDetailsType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Inject, Injectable } from '@nestjs/common';

import {
  AUTH_PROVIDER_SERVICE,
  IAuthProviderService,
  IConfirmPasswordParams,
  IForgotPasswordParams,
  ISignInParams,
  ISignUpParams,
} from '../interfaces/auth-provider.service.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_PROVIDER_SERVICE)
    private readonly authProviderService: IAuthProviderService,
  ) {}

  async signUp(signUpParams: ISignUpParams): Promise<string> {
    return await this.authProviderService.signUp(signUpParams);
  }

  async signIn(signInParams: ISignInParams): Promise<AuthenticationResultType> {
    return await this.authProviderService.signIn(signInParams);
  }

  async forgotPassword(
    forgotPasswordParams: IForgotPasswordParams,
  ): Promise<CodeDeliveryDetailsType> {
    return await this.authProviderService.forgotPassword(forgotPasswordParams);
  }

  async confirmPassword(
    confirmPasswordParams: IConfirmPasswordParams,
  ): Promise<boolean> {
    return await this.authProviderService.confirmPassword(
      confirmPasswordParams,
    );
  }
}
