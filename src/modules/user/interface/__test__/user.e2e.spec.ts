import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';
import { Role } from '../../domain/format.enum';

describe('User - [/user]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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

  const schemaResp = expect.objectContaining({
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    firstName: expect.any(String),
    lastName: expect.any(String),
    dob: expect.any(String),
    email: expect.any(String),
    address: expect.any(String),
    country: expect.any(String),
    role: expect.any(Role),
  });

  describe('Get all - [GET /user]', () => {
    it('should return an array of users', async () => {
      const EXPECTED_LENGTH = 2;

      const { body } = await request(app.getHttpServer())
        .get('/user')
        .expect(HttpStatus.OK);

      const expectedUsers = expect.arrayContaining([
        expect.objectContaining({
          id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          firstName: 'Mauro',
          lastName: 'Zangaro',
          dob: '1991-01-02',
          email: 'mauro@google.com',
          address: 'Lugano 345',
          country: 'Argentina',
        }),
        expect.objectContaining({
          id: 2,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          firstName: 'Hernán',
          lastName: 'Gatitos',
          dob: '1990-01-02',
          email: 'hernan@google.com',
          address: 'Caseros 345',
          country: 'Argentina',
        }),
      ]);

      expect(body).toEqual(expectedUsers);
      expect(body).toHaveLength(EXPECTED_LENGTH);
    });
  });

  describe('Get - [GET /user/:id', () => {
    it('should return not found error', async () => {
      const USER_ID = 999;

      const { body } = await request(app.getHttpServer())
        .get(`/user/${USER_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual({
        error: `Not Found`,
        message: `User with id ${USER_ID} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });

    it('should return the specified user', async () => {
      const USER_ID = 1;

      const { body } = await request(app.getHttpServer())
        .get(`/user/${USER_ID}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(
        expect.objectContaining({
          id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          firstName: 'Mauro',
          lastName: 'Zangaro',
          dob: '1991-01-02',
          email: 'mauro@google.com',
          address: 'Lugano 345',
          country: 'Argentina',
        }),
      );
    });
  });

  describe('Create - [POST /user]', () => {
    it('should create an user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Matias',
        lastName: 'Nardone',
        dob: new Date('1993-01-02'),
        email: 'matias@google.com',
        address: 'Ejército 100',
        country: 'Argentina',
      };

      const { body } = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(HttpStatus.CREATED);

      const expectedResponse = expect.objectContaining({
        id: 3,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        firstName: 'Matias',
        lastName: 'Nardone',
        dob: expect.any(String),
        email: 'matias@google.com',
        address: 'Ejército 100',
        country: 'Argentina',
      });

      expect(body).toEqual(expectedResponse);
    });

    it('should return bad request error', async () => {
      const createUserDto = {
        firstName: 'Mauro',
        lastName: 'Zangaro',
        dob: new Date('1993-01-02'),
        address: 'Ejército 100',
        country: 'Argentina',
      };

      const { body } = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(HttpStatus.BAD_REQUEST);

      const expectedResponse = expect.objectContaining({
        error: `Bad Request`,
        message: ['email must be an email'],
        statusCode: HttpStatus.BAD_REQUEST,
      });

      expect(body).toEqual(expectedResponse);
    });
  });

  describe('Patch - [PATCH /user/:id]', () => {
    const updateUserDto: UpdateUserDto = {
      address: 'Sidney 425',
      country: 'Australia',
    };

    it('should update the specified values', async () => {
      const USER_TO_UPDATE = 1;

      const { body } = await request(app.getHttpServer())
        .patch(`/user/${USER_TO_UPDATE}`)
        .send(updateUserDto)
        .expect(HttpStatus.ACCEPTED);

      expect(body).toEqual(
        expect.objectContaining({
          id: 1,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          firstName: 'Mauro',
          lastName: 'Zangaro',
          dob: '1991-01-02',
          email: 'mauro@google.com',
          address: 'Sidney 425',
          country: 'Australia',
        }),
      );
    });

    it('should return not found error', async () => {
      const USER_TO_UPDATE = 999;

      const { body } = await request(app.getHttpServer())
        .patch(`/user/${USER_TO_UPDATE}`)
        .send(updateUserDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual({
        error: `Not Found`,
        message: `User with id ${USER_TO_UPDATE} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  describe('Delete - [DELETE /user]', () => {
    it('should delete the specified user', async () => {
      const USER_ID = 1;

      const { body } = await request(app.getHttpServer())
        .delete(`/user/${USER_ID}`)
        .expect(HttpStatus.OK);

      console.log(body);

      expect(body).toEqual({});
    });

    it('should return not found error', async () => {
      const USER_ID = 999;

      const { body } = await request(app.getHttpServer())
        .delete(`/user/${USER_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      console.log(body);

      expect(body).toEqual({
        error: `Not Found`,
        message: `User with id ${USER_ID} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
