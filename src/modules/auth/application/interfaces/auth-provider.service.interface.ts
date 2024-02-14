import {
  AuthenticationResultType,
  CodeDeliveryDetailsType,
} from '@aws-sdk/client-cognito-identity-provider';

export interface ISignInParams {
  email: string;
  password: string;
}
export interface ISignUpParams {
  username: string;
  email: string;
  password: string;
}
export interface IForgotPasswordParams {
  email: string;
}
export interface IConfirmPasswordParams {
  email: string;
  confirmationCode: string;
  newPassword: string;
}

export const AUTH_PROVIDER_SERVICE = 'AUTH_PROVIDER_SERVICE';
export interface IAuthProviderService {
  signUp(signUpParams: ISignUpParams): Promise<string>;
  signIn(signInParams: ISignInParams): Promise<AuthenticationResultType>;
  forgotPassword(
    forgotPasswordParams: IForgotPasswordParams,
  ): Promise<CodeDeliveryDetailsType>;
  confirmPassword(
    confirmPasswordParams: IConfirmPasswordParams,
  ): Promise<boolean>;
}
