import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

import {
  AUTH_ERRORS,
  AuthInternalServerError,
  UserAlreadyExistsError,
  UserNotConfirmedError,
  UserNotFoundError,
} from '../../application/exceptions/auth.errors';
import { AUTH_PROVIDER_SERVICE } from '../../application/interfaces/auth-provider.service.interface';

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
    it('should sign up a user', async () => {
      const MOCK_SIGN_UP_RESULT = {
        UserSub: '0845462d-de44-4417-a89d-c09ff3e29f7c',
      };

      jest
        .spyOn(mockedCognitoService, 'signUp')
        .mockResolvedValue(MOCK_SIGN_UP_RESULT);

      const signUpDto = {
        username: 'test1',
        email: 'test1@google.com',
        password: 'Test12345',
      };

      const { body } = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(signUpDto)
        .expect(201);

      const expectedResponse = {
        UserSub: expect.any(String),
      };

      expect(body).toEqual(expectedResponse);
    });

    it('Should throw UserAlreadyExistsError', async () => {
      jest
        .spyOn(mockedCognitoService, 'signUp')
        .mockRejectedValue(
          new UserAlreadyExistsError(AUTH_ERRORS.USER_ALREADY_EXISTS),
        );

      const signUpDto = {
        username: 'test1',
        email: 'test1@google.com',
        password: 'Test12345',
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

      const signUpDto = {
        username: 'test1',
        email: 'test1@google.com',
        password: 'Test12345',
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
        AccessToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNvZ25pdG9Mb2NhbCJ9.eyJhdXRoX3RpbWUiOjE3MDc5MjEwNDMsImNsaWVudF9pZCI6IjB5Zmk4ZjB6dTBmdGNqbDNqNnoyOXFnOXkiLCJldmVudF9pZCI6Ijg4MWE3YmEzLTYzMDAtNDQ2Zi05MjZjLTZiNjIwNGJjNTU0YyIsImlhdCI6MTcwNzkyMTA0MywianRpIjoiOWJhN2FkMTgtYzA2MC00YmZmLWFmYTEtOTk2OWMzZjZiMDRiIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsInN1YiI6ImZiNzhmZDBlLTE3YWMtNDRkZC1iZWM1LTZmMTQwNTg5YWZkYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiR2FicmllbCIsImV4cCI6MTcwODAwNzQ0MywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo5MjI5L2xvY2FsXzBaZnhLRVVwIn0.d1u73UWd7VnUV7vk7YEz_zFLWKKeNWdl8t9nID4d9P2ES03t9ZN6Hpbu6a_sLLdOBE0s0GCmKC01O-GEKBYPwvfMiejQH7xjFIycU4SmnYuQcX5GUDwQOGXTw61_FuKOmKYZAfGq21R-R-JN5nWimWtUB3Hi4uty_ExqhC_irCwH7-Sq85s-gdQBqVkC5ZqdzJjfEKWvNESKUhXTcAwjmP4QqTtfqilVnQ05LQKzHpZyzVsPOvl2heKPTw726ySGjLwd8ZjKQeRYV6FOjRX-nZhW_jy8qKkWap6t-r066umm2frvfyq-Izb4Wye3LSH16gfvQpfKjplzyQN6Ooh1oQ',
        IdToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkNvZ25pdG9Mb2NhbCJ9.eyJjb2duaXRvOnVzZXJuYW1lIjoiR2FicmllbCIsImF1dGhfdGltZSI6MTcwNzkyMTA0MywiZW1haWwiOiJnYWJyaWVsLmYubmFyZG9uZUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImV2ZW50X2lkIjoiODgxYTdiYTMtNjMwMC00NDZmLTkyNmMtNmI2MjA0YmM1NTRjIiwiaWF0IjoxNzA3OTIxMDQzLCJqdGkiOiJkNDY4NzYzOC00MjJiLTQ0MTAtYTU0Mi04NzliMzA5NzQwOTYiLCJzdWIiOiJmYjc4ZmQwZS0xN2FjLTQ0ZGQtYmVjNS02ZjE0MDU4OWFmZGIiLCJ0b2tlbl91c2UiOiJpZCIsImV4cCI6MTcwODAwNzQ0MywiYXVkIjoiMHlmaThmMHp1MGZ0Y2psM2o2ejI5cWc5eSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTIyOS9sb2NhbF8wWmZ4S0VVcCJ9.CZndqEeAFM-e3EHyb6cPbCNoDkDtkm7y1S15JVDqTV8XVyg5uD6Id8OO-q_2TBIN5OXtsytN611ygK6hultJMHjtogWVZDtnBGd8pzgIKOIgJVAfbdLpPdWGQs9CrJVcqaeBcnrJj6kPXyx1DsWPLTWM_ag0MOOMO0tzKvIF8lfn8WSVohKNQk23GMM29yDzkWDbbzUQYX_lkxOvppfjH4c8dDK6iPaIoQvcQfp1HjFEtC4fQfABUnS6CxdpgNWChLB9NFHvg77TfPY-2m-EzYyogUTa4c86RsCfMB650ijuwe5RYM6cVE75LqOWc7f3TD1hLzKinq-h1RYEtqFgww',
        RefreshToken:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2duaXRvOnVzZXJuYW1lIjoiR2FicmllbCIsImVtYWlsIjoiZ2FicmllbC5mLm5hcmRvbmVAZ21haWwuY29tIiwiaWF0IjoxNzA3OTIxMDQzLCJqdGkiOiIxZTcyYmU1OS0yZGVhLTRhNDEtOGMyYy00Njc0YjgyODJmOGQiLCJleHAiOjE3MDg1MjU4NDMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTIyOS9sb2NhbF8wWmZ4S0VVcCJ9.VShXGgbCT0hVJcOsJSci6C4rAdJ-YCLlXfkpdGXtRf3HJ25V7YeEy45AR04OnbFS2T2Q6tjcvWV6SNZaYWFvi-Fksb8BBYujsnoBIiLYPUgBnLqE3Mqu2TVF0SLZP4JG-0HhCnWztOIQ3lbEgqokZ0qbU_UMyLTL1f7O-gkiiRFWtenu7MdTomljk8Vd0lJ9GWVRaCLP_bgAgOHyIbQXm4Oiazf5NlhqyE6KgDuJhIJ2s_t_z7nlKMqtr--fZbeDiITFat_9kLVQdZIu7rL6M0vos3PA-bDk35NVcanAC1LbAGaM-4BCTiaQhQuz5UiSbCyUgJoSdbNeN-XdQsiGaw',
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
        .expect(400);

      expect(body).toEqual(expectedErrorResponse);
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
        .expect(400);

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
        .expect(400);

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
});
