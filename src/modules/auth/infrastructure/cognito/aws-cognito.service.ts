import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  InitiateAuthCommand,
  InvalidPasswordException,
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
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '../../application/exception/auth.error';
import {
  IAuthProviderService,
  IConfirmPasswordParams,
  IForgotPasswordParams,
  ISignInParams,
  ISignUpParams,
  ITokenGroup,
} from '../../application/interface/auth-provider.service.interface';

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
    const { email, password } = signUpParams;

    try {
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: email,
        Password: password,
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

  async signIn(signInParams: ISignInParams): Promise<ITokenGroup> {
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
      if (error instanceof InvalidPasswordException) {
        throw new InvalidPasswordError(AUTH_ERRORS.INVALID_PASSWORD);
      }
      console.error(error);
      throw new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR);
    }
  }

  async forgotPassword(
    forgotPasswordParams: IForgotPasswordParams,
  ): Promise<string> {
    const { email } = forgotPasswordParams;

    const input = {
      ClientId: this.clientId,
      Username: email,
    };

    try {
      const command = new ForgotPasswordCommand(input);

      const {
        CodeDeliveryDetails: { Destination },
      } = await this.cognitoClient.send(command);

      return Destination;
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
