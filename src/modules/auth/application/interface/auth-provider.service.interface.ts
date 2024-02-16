export interface ISignInParams {
  email: string;
  password: string;
}
export interface ISignUpParams {
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
export interface ITokenGroup {
  AccessToken?: string;
  IdToken?: string;
  RefreshToken?: string;
}

export const AUTH_PROVIDER_SERVICE = 'AUTH_PROVIDER_SERVICE';
export interface IAuthProviderService {
  signUp(signUpParams: ISignUpParams): Promise<string>;
  signIn(signInParams: ISignInParams): Promise<ITokenGroup>;
  forgotPassword(forgotPasswordParams: IForgotPasswordParams): Promise<string>;
  confirmPassword(
    confirmPasswordParams: IConfirmPasswordParams,
  ): Promise<boolean>;
}
