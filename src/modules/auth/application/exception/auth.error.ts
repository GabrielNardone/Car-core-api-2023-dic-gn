import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export enum AUTH_ERRORS {
  SERVER_ERROR = 'Server error, something went wrong in server side',
  SIGN_IN_ERROR = 'Sign in failed',
  SIGN_UP_ERROR = 'Sign up failed',
  FORGOT_PASSWORD_ERROR = 'Forgot password failed',
  CONFIRM_PASSWORD_ERROR = 'Confirm password failed',
  USER_ALREADY_EXISTS = 'The user already exists in data base',
  USER_NOT_FOUND = 'User was not found in data base',
  INVALID_PASSWORD = 'Invalid password',
  USER_NOT_CONFIRMED = 'User isn´t confirmed successfully',
}

export class AuthInternalServerError extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
    this.name = 'AuthInternalServerError';
  }
}

export class UserAlreadyExistsError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends NotFoundException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidPasswordError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPasswordError';
  }
}

export class UserNotConfirmedError extends BadRequestException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotConfirmedError';
  }
}
