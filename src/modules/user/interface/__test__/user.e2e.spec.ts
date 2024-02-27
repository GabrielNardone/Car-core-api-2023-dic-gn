import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';
import { MockGuard } from '@/common/mock/jwt-auth-guard.mock';
import { GlobalAuthGuard } from '@/modules/auth/application/guard/auth.guard';

import { UpdateUserDto } from '../../application/dto/update-user.dto';

describe('User - [/user]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GlobalAuthGuard)
      .useClass(MockGuard)
      .compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'configuration/orm.configuration.ts',
      ),
    );

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  const handleNotFoundResponse = (userId: number) => {
    return {
      error: `Not Found`,
      message: `User with id ${userId} not found`,
      statusCode: HttpStatus.NOT_FOUND,
    };
  };

  const expectedUser = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
    dob: expect.any(String),
    email: expect.any(String),
    address: expect.any(String),
    country: expect.any(String),
    role: expect.any(String),
  };

  describe('Get all - [GET /user]', () => {
    it('should return an array of users', async () => {
      const EXPECTED_LENGTH = 2;

      const { body } = await request(app.getHttpServer())
        .get('/user')
        .expect(HttpStatus.OK);

      const expectedUsers = expect.arrayContaining([
        expect.objectContaining({ ...expectedUser, id: 1 }),
        expect.objectContaining({ ...expectedUser, id: 2 }),
      ]);

      expect(body).toEqual(expectedUsers);
      expect(body).toHaveLength(EXPECTED_LENGTH);
    });
  });

  describe('Get one by id - [GET /user/:id', () => {
    it('should throw not found error if id doesn´t exist', async () => {
      const USER_ID = 999;

      const { body } = await request(app.getHttpServer())
        .get(`/user/${USER_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(USER_ID));
    });

    it('should return the specified user', async () => {
      const USER_ID = 1;

      const { body } = await request(app.getHttpServer())
        .get(`/user/${USER_ID}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(expect.objectContaining({ ...expectedUser, id: 1 }));
    });
  });

  describe('Update one by id - [PATCH /user/:id]', () => {
    const updateUserDto: UpdateUserDto = {
      address: 'Sidney 425',
      country: 'Australia',
    };

    it('should update an user with specified values', async () => {
      const USER_ID = 1;

      const { body } = await request(app.getHttpServer())
        .patch(`/user/${USER_ID}`)
        .send(updateUserDto)
        .expect(HttpStatus.ACCEPTED);

      expect(body).toEqual(
        expect.objectContaining({
          ...expectedUser,
          ...updateUserDto,
          id: 1,
        }),
      );
    });

    it('should throw not found error if user does´nt exist', async () => {
      const USER_ID = 999;

      const { body } = await request(app.getHttpServer())
        .patch(`/user/${USER_ID}`)
        .send(updateUserDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(USER_ID));
    });
  });

  describe('Delete one by id - [DELETE /user/:id]', () => {
    it('should delete the specified user', async () => {
      const USER_ID = 1;
      const RESPONSE = 'true';

      const { text } = await request(app.getHttpServer())
        .delete(`/user/${USER_ID}`)
        .expect(HttpStatus.OK);

      expect(text).toEqual(RESPONSE);
    });

    it('should throw not found error if user does´nt exist', async () => {
      const USER_ID = 999;

      const { body } = await request(app.getHttpServer())
        .delete(`/user/${USER_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(USER_ID));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
