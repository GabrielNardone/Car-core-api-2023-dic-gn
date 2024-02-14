import {
  AuthFlowType,
  AuthenticationResultType,
  CodeDeliveryDetailsType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  SignUpCommand,
  UserNotConfirmedException,
  UserNotFoundException,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AUTH_ERRORS,
  AuthInternalServerError,
  UserAlreadyExistsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '../exceptions/auth.errors';
import {
  IAuthProviderService,
  IConfirmPasswordParams,
  IForgotPasswordParams,
  ISignInParams,
  ISignUpParams,
} from '../interfaces/auth-provider.service.interface';

@Injectable()
export class AwsCognitoService implements IAuthProviderService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  private readonly clientId = this.configService.get('cognito.clientId');
  private readonly endpoint = this.configService.get('cognito.endpoint');
  private readonly region = this.configService.get('cognito.region');
  private readonly accessKey = this.configService.get('cognito.accessKey');
  private readonly secretKey = this.configService.get('cognito.secretKey');

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  async signUp(signUpParams: ISignUpParams): Promise<string> {
    const { username, email, password } = signUpParams;
    const userAttributes = [{ Name: 'email', Value: email }];

    try {
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: username,
        Password: password,
        UserAttributes: userAttributes,
      });

      const { UserSub } = await this.cognitoClient.send(command);

      return UserSub;
    } catch (error: unknown) {
      if (error instanceof UsernameExistsException) {
        throw new UserAlreadyExistsError(AUTH_ERRORS.USER_ALREADY_EXISTS);
      }
      console.error(error);
      throw new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR);
    }
  }

  async signIn(signInParams: ISignInParams): Promise<AuthenticationResultType> {
    const { email, password } = signInParams;

    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
        ClientId: this.clientId,
      });

      const { AuthenticationResult } = await this.cognitoClient.send(command);

      return AuthenticationResult;
    } catch (error: unknown) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(AUTH_ERRORS.USER_NOT_FOUND);
      }
      console.error(error);
      throw new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR);
    }
  }

  async forgotPassword(
    forgotPasswordParams: IForgotPasswordParams,
  ): Promise<CodeDeliveryDetailsType> {
    const { email } = forgotPasswordParams;

    const input = {
      ClientId: this.clientId,
      Username: email,
    };

    try {
      const command = new ForgotPasswordCommand(input);

      const { CodeDeliveryDetails } = await this.cognitoClient.send(command);

      return CodeDeliveryDetails;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(AUTH_ERRORS.USER_NOT_FOUND);
      }
      console.error(error);
      throw new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR);
    }
  }

  async confirmPassword(
    authConfirmPasswordParams: IConfirmPasswordParams,
  ): Promise<boolean> {
    const { email, confirmationCode, newPassword } = authConfirmPasswordParams;

    const input = {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
    };

    try {
      const command = new ConfirmForgotPasswordCommand(input);

      await this.cognitoClient.send(command);

      return true;
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UserNotFoundError(AUTH_ERRORS.USER_NOT_FOUND);
      }
      if (error instanceof UserNotConfirmedException) {
        throw new UserNotConfirmedError(AUTH_ERRORS.USER_NOT_CONFIRMED);
      }
      console.error(error);
      throw new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR);
    }
  }
}
