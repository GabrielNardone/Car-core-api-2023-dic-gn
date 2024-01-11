import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';

import { CreateRentDto } from '../../application/dto/create-rent.dto';
import { UpdateRentDto } from '../../application/dto/update-rent.dto';

describe('Rent - [/rent]', () => {
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

  const handleNotFoundResponse = (rentId: number) => {
    return {
      error: `Not Found`,
      message: `Rent with id ${rentId} not found`,
      statusCode: HttpStatus.NOT_FOUND,
    };
  };

  const expectedRent = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    pricePerDay: expect.any(Number),
    aceptedDay: expect.any(String),
    startingDay: expect.any(String),
    dueDay: expect.any(String),
    endDay: expect.any(Number),
    rejected: expect.any(Boolean),
  };

  describe('Get all - [GET /rent]', () => {
    it('should return an array of rents', async () => {
      const EXPECTED_LENGTH = 2;

      const { body } = await request(app.getHttpServer())
        .get('/rent')
        .expect(HttpStatus.OK);

      const expectedRents = expect.arrayContaining([
        expect.objectContaining({ ...expectedRent, id: 1 }),
        expect.objectContaining({ ...expectedRent, id: 2 }),
      ]);

      expect(body).toEqual(expectedRents);
      expect(body).toHaveLength(EXPECTED_LENGTH);
    });
  });

  describe('Get one by id - [GET /rent/:id', () => {
    it('should throw not found error if id doesn´t exist', async () => {
      const RENT_ID = 999;

      const { body } = await request(app.getHttpServer())
        .get(`/rent/${RENT_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(RENT_ID));
    });

    it('should return the specified rent', async () => {
      const RENT_ID = 1;

      const { body } = await request(app.getHttpServer())
        .get(`/rent/${RENT_ID}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(expect.objectContaining({ ...expectedRent, id: 1 }));
    });
  });

  describe('Create - [POST /rent]', () => {
    const createRentDto: CreateRentDto = {
      pricePerDay: 10000,
      aceptedDate: new Date('2024/04/11'),
      startingDate: new Date('2024/04/11'),
      dueDate: new Date('2024/05/11'),
      endDate: new Date('2024/05/11'),
      rejected: false,
    };

    it('should create a rent', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/rent')
        .send(createRentDto)
        .expect(HttpStatus.CREATED);

      const expectedResponse = expect.objectContaining({
        ...expectedRent,
        id: 3,
      });

      expect(body).toEqual(expectedResponse);
    });

    it('should throw bad request error if the number of passenger is higher than 8', async () => {
      const createWrongRentDto = {
        ...createRentDto,
        pricePerDay: '10000',
      };

      const { body } = await request(app.getHttpServer())
        .post('/rent')
        .send(createWrongRentDto)
        .expect(HttpStatus.BAD_REQUEST);

      const expectedResponse = expect.objectContaining({
        error: `Bad Request`,
        message: ['passengers must not be greater than 8'],
        statusCode: HttpStatus.BAD_REQUEST,
      });

      expect(body).toEqual(expectedResponse);
    });
  });

  describe('Update one by id - [PATCH /rent/:id]', () => {
    const updateRentDto: UpdateRentDto = {
      rejected: true,
    };

    it('should update a rent with specified values', async () => {
      const RENT_ID = 1;

      const { body } = await request(app.getHttpServer())
        .patch(`/rent/${RENT_ID}`)
        .send(updateRentDto)
        .expect(HttpStatus.ACCEPTED);

      expect(body).toEqual(
        expect.objectContaining({
          ...expectedRent,
          ...updateRentDto,
          id: 1,
        }),
      );
    });

    it('should throw not found error if rent does´nt exist', async () => {
      const RENT_ID = 999;

      const { body } = await request(app.getHttpServer())
        .patch(`/rent/${RENT_ID}`)
        .send(updateRentDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(RENT_ID));
    });
  });

  describe('Delete one by id - [DELETE /rent/:id]', () => {
    it('should delete the specified rent', async () => {
      const RENT_ID = 1;
      const RESPONSE = 'true';

      const { text } = await request(app.getHttpServer())
        .delete(`/rent/${RENT_ID}`)
        .expect(HttpStatus.OK);

      expect(text).toEqual(RESPONSE);
    });

    it('should throw not found error if rent does´nt exist', async () => {
      const RENT_ID = 999;

      const { body } = await request(app.getHttpServer())
        .delete(`/rent/${RENT_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(RENT_ID));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
