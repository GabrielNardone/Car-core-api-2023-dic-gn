import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export enum AUTH_ERRORS {
  SERVER_ERROR = 'Server error, something went wrong in server side',
  SIGN_IN_ERROR = 'Sign in falied',
  SIGN_UP_ERROR = 'Sign up falied',
  FORGOT_PASSWORD_ERROR = 'Forgot password falied',
  CONFIRM_PASSWORD_ERROR = 'Confirm password falied',
  USER_ALREADY_EXISTS = 'User already exists',
  USER_NOT_FOUND = 'User not found',
  USER_NOT_CONFIRMED = 'User isn´t confirmed successfully',
}

export class AuthInternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
    this.name = 'SignUpError';
  }
}

export class UserAlreadyExistsError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class UserNotConfirmedError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotConfirmedError';
  }
}
