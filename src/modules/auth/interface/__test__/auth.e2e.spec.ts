import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

import { SignUpDto } from '../../application/dto/sign-up.dto';
import {
  AUTH_ERRORS,
  AuthInternalServerError,
  InvalidPasswordError,
  UserAlreadyExistsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '../../application/exception/auth.error';
import { AUTH_PROVIDER_SERVICE } from '../../application/interface/auth-provider.service.interface';

const mockedCognitoService = {
  signUp: jest.fn(),
  signIn: jest.fn(),
  forgotPassword: jest.fn(),
  confirmPassword: jest.fn(),
};

describe('Auth - [/auth]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AUTH_PROVIDER_SERVICE)
      .useValue(mockedCognitoService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  const expectedErrorResponse = {
    error: expect.any(String),
    message: expect.any(String),
    statusCode: expect.any(Number),
  };

  describe('Sign up - [POST /auth/sign-up]', () => {
    const expectedResponse = {
      firstName: expect.any(String),
      lastName: expect.any(String),
      dob: expect.any(String),
      email: expect.any(String),
      address: expect.any(String),
      country: expect.any(String),
      role: expect.any(String),
      externalId: expect.any(String),
      id: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    };

    it('should sign up a user', async () => {
      const MOCK_SIGN_UP_RESULT = '0845462d-de44-4417-a89d-c09ff3e29f7c';

      jest
        .spyOn(mockedCognitoService, 'signUp')
        .mockResolvedValue(MOCK_SIGN_UP_RESULT);

      const signUpDto: SignUpDto = {
        email: 'hegel@gmail.com',
        password: 'Hegel123',
        firstName: 'Willhelm',
        lastName: 'Hegel',
        dob: new Date('1877-02-04'),
        address: 'Berlín 1234',
        country: 'Deutchland',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(201);

      expect(body).toEqual(expectedResponse);
    });

    it('Should throw UserAlreadyExistsError', async () => {
      jest
        .spyOn(mockedCognitoService, 'signUp')
        .mockRejectedValue(
          new UserAlreadyExistsError(AUTH_ERRORS.USER_ALREADY_EXISTS),
        );

      const signUpDto: SignUpDto = {
        email: 'hegel@gmail.com',
        password: 'Hegel123',
        firstName: 'Willhelm',
        lastName: 'Hegel',
        dob: new Date('1877-02-04'),
        address: 'Berlín 1234',
        country: 'Deutchland',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(400);

      expect(body).toEqual(expectedErrorResponse);
    });

    it('Should throw AuthInternalServerError', async () => {
      jest
        .spyOn(mockedCognitoService, 'signUp')
        .mockRejectedValue(
          new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR),
        );

      const signUpDto: SignUpDto = {
        email: 'kant@gmail.com',
        password: 'Hegel123',
        firstName: 'Willhelm',
        lastName: 'Hegel',
        dob: new Date('1877-02-04'),
        address: 'Berlín 1234',
        country: 'Deutchland',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(500);

      expect(body).toEqual(expectedErrorResponse);
    });
  });

  describe('Sign in - [POST /auth/sign-in]', () => {
    it('Should sign in user', async () => {
      const MOCK_SIGN_IN_RESULT = {
        AccessToken: 'test',
        IdToken: 'test',
        RefreshToken: 'test',
      };

      jest
        .spyOn(mockedCognitoService, 'signIn')
        .mockResolvedValue(MOCK_SIGN_IN_RESULT);

      const signInDto = {
        email: 'test1@google.com',
        password: 'Test12345',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto)
        .expect(201);

      const expectedResult = {
        AccessToken: expect.any(String),
        IdToken: expect.any(String),
        RefreshToken: expect.any(String),
      };

      expect(body).toEqual(expectedResult);
    });

    it('Should throw UserNotFoundError', async () => {
      jest
        .spyOn(mockedCognitoService, 'signIn')
        .mockRejectedValue(new UserNotFoundError(AUTH_ERRORS.USER_NOT_FOUND));

      const signInDto = {
        email: 'test1@google.com',
        password: 'Test12345',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto)
        .expect(404);

      expect(body).toEqual(expectedErrorResponse);
    });

    it('Should throw InvalidPasswordError', async () => {
      jest
        .spyOn(mockedCognitoService, 'signIn')
        .mockRejectedValue(
          new InvalidPasswordError(AUTH_ERRORS.INVALID_PASSWORD),
        );

      const signInDto = {
        email: 'test1@google.com',
        password: 'invalid1',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto)
        .expect(400);

      expect(body).toEqual({
        ...expectedErrorResponse,
        message: ['Invalid password'],
      });
    });

    it('Should throw AuthInternalServerError', async () => {
      jest
        .spyOn(mockedCognitoService, 'signIn')
        .mockRejectedValue(
          new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR),
        );

      const signInDto = {
        email: 'test1@google.com',
        password: 'Test12345',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send(signInDto)
        .expect(500);

      expect(body).toEqual(expectedErrorResponse);
    });
  });

  describe('Forgot password - [POST /auth/forgot-password]', () => {
    it('Should initiate forgot password process', async () => {
      const MOCK_FORGOT_PASSWORD_RESULT = {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: 'test1@google.com',
      };

      jest
        .spyOn(mockedCognitoService, 'forgotPassword')
        .mockResolvedValue(MOCK_FORGOT_PASSWORD_RESULT);

      const forgotPasswordDto = {
        email: 'test1@google.com',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .expect(201);

      const expectedResponse = {
        AttributeName: expect.any(String),
        DeliveryMedium: expect.any(String),
        Destination: expect.any(String),
      };

      expect(body).toEqual(expectedResponse);
    });

    it('Should throw UserNotFoundError', async () => {
      jest
        .spyOn(mockedCognitoService, 'forgotPassword')
        .mockRejectedValue(new UserNotFoundError(AUTH_ERRORS.USER_NOT_FOUND));

      const forgotPasswordDto = {
        email: 'test1@google.com',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .expect(404);

      expect(body).toEqual(expectedErrorResponse);
    });

    it('Should throw AuthInternalServerError', async () => {
      jest
        .spyOn(mockedCognitoService, 'forgotPassword')
        .mockRejectedValue(
          new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR),
        );

      const forgotPasswordDto = {
        email: 'test1@google.com',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send(forgotPasswordDto)
        .expect(500);

      expect(body).toEqual(expectedErrorResponse);
    });
  });

  describe('Confirm password - [POST /auth/confirm-password]', () => {
    it('Should change password', async () => {
      const MOCK_CONFIRM_PASSWORD_RESULT = 'true';

      jest
        .spyOn(mockedCognitoService, 'confirmPassword')
        .mockResolvedValue(MOCK_CONFIRM_PASSWORD_RESULT);

      const confirmPasswordDto = {
        email: 'test1@google.com',
        confirmationCode: '123456',
        newPassword: 'Testing125',
      };

      const { text } = await request(app.getHttpServer())
        .post('/auth/confirm-password')
        .send(confirmPasswordDto)
        .expect(201);

      expect(text).toEqual(MOCK_CONFIRM_PASSWORD_RESULT);
    });

    it('Should throw UserNotFoundError', async () => {
      jest
        .spyOn(mockedCognitoService, 'confirmPassword')
        .mockRejectedValue(new UserNotFoundError(AUTH_ERRORS.USER_NOT_FOUND));

      const confirmPasswordDto = {
        email: 'test1@google.com',
        confirmationCode: '123456',
        newPassword: 'Testing125',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/confirm-password')
        .send(confirmPasswordDto)
        .expect(404);

      expect(body).toEqual(expectedErrorResponse);
    });

    it('Should throw UserNotConfirmedError', async () => {
      jest
        .spyOn(mockedCognitoService, 'confirmPassword')
        .mockRejectedValue(
          new UserNotConfirmedError(AUTH_ERRORS.USER_NOT_CONFIRMED),
        );

      const confirmPasswordDto = {
        email: 'test1@google.com',
        confirmationCode: '123456',
        newPassword: 'Testing125',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/confirm-password')
        .send(confirmPasswordDto)
        .expect(400);

      expect(body).toEqual(expectedErrorResponse);
    });

    it('Should throw AuthInternalServerError', async () => {
      jest
        .spyOn(mockedCognitoService, 'confirmPassword')
        .mockRejectedValue(
          new AuthInternalServerError(AUTH_ERRORS.SERVER_ERROR),
        );

      const confirmPasswordDto = {
        email: 'test1@google.com',
        confirmationCode: '123456',
        newPassword: 'Testing125',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/confirm-password')
        .send(confirmPasswordDto)
        .expect(500);

      expect(body).toEqual(expectedErrorResponse);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
