import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';
import { MockGuard } from '@/common/mock/jwt-auth-guard.mock';
import { GlobalAuthGuard } from '@/modules/auth/interface/guard/auth.guard';
import { RoleGuard } from '@/modules/auth/interface/guard/roles.guard';

import { CreateCarDto } from '../../application/dto/create-car.dto';
import { UpdateCarDto } from '../../application/dto/update-car.dto';

describe('Car - [/car]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(GlobalAuthGuard)
      .useClass(MockGuard)
      .overrideProvider(RoleGuard)
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

  const handleNotFoundResponse = (carId: number) => {
    return {
      error: `Not Found`,
      message: `Car with id ${carId} not found`,
      statusCode: HttpStatus.NOT_FOUND,
    };
  };

  const expectedCar = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    brand: expect.any(String),
    model: expect.any(String),
    color: expect.any(String),
    passengers: expect.any(Number),
    ac: expect.any(Boolean),
    pricePerDay: expect.any(Number),
  };

  describe('Get all - [GET /car]', () => {
    it('should return an array of cars', async () => {
      const EXPECTED_LENGTH = 2;

      const { body } = await request(app.getHttpServer())
        .get('/car')
        .expect(HttpStatus.OK);

      const expectedCars = expect.arrayContaining([
        expect.objectContaining({ ...expectedCar, id: 1 }),
        expect.objectContaining({ ...expectedCar, id: 2 }),
      ]);

      expect(body).toEqual(expectedCars);
      expect(body).toHaveLength(EXPECTED_LENGTH);
    });
  });

  describe('Get one by id - [GET /car/:id', () => {
    it('should throw not found error if id doesn´t exist', async () => {
      const CAR_ID = 999;

      const { body } = await request(app.getHttpServer())
        .get(`/car/${CAR_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(CAR_ID));
    });

    it('should return the specified car', async () => {
      const CAR_ID = 1;

      const { body } = await request(app.getHttpServer())
        .get(`/car/${CAR_ID}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(expect.objectContaining({ ...expectedCar, id: 1 }));
    });
  });

  describe('Create - [POST /car]', () => {
    const createCarDto: CreateCarDto = {
      brand: 'Honda',
      model: 'Omega',
      color: 'Opaque white',
      passengers: 4,
      ac: true,
      pricePerDay: 20000,
    };

    it('should create a car', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/car')
        .send(createCarDto)
        .expect(HttpStatus.CREATED);

      const expectedResponse = expect.objectContaining({
        ...expectedCar,
        id: 3,
        model: 'Omega',
      });

      expect(body).toEqual(expectedResponse);
    });

    it('should throw bad request error if the number of passenger is higher than 8', async () => {
      const createWrongCarDto: CreateCarDto = {
        ...createCarDto,
        passengers: 44,
      };

      const { body } = await request(app.getHttpServer())
        .post('/car')
        .send(createWrongCarDto)
        .expect(HttpStatus.BAD_REQUEST);

      const expectedResponse = expect.objectContaining({
        error: `Bad Request`,
        message: ['passengers must not be greater than 8'],
        statusCode: HttpStatus.BAD_REQUEST,
      });

      expect(body).toEqual(expectedResponse);
    });
  });

  describe('Update one by id - [PATCH /car/:id]', () => {
    const updateCarDto: UpdateCarDto = {
      color: 'Green',
      pricePerDay: 14000,
    };

    it('should update a car with specified values', async () => {
      const CAR_ID = 1;

      const { body } = await request(app.getHttpServer())
        .patch(`/car/${CAR_ID}`)
        .send(updateCarDto)
        .expect(HttpStatus.ACCEPTED);

      expect(body).toEqual(
        expect.objectContaining({
          ...expectedCar,
          ...updateCarDto,
          id: 1,
        }),
      );
    });

    it('should throw not found error if car does´nt exist', async () => {
      const CAR_ID = 999;

      const { body } = await request(app.getHttpServer())
        .patch(`/car/${CAR_ID}`)
        .send(updateCarDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(CAR_ID));
    });
  });

  describe('Delete one by id - [DELETE /car/:id]', () => {
    it('should delete the specified car', async () => {
      const CAR_ID = 1;
      const RESPONSE = 'true';

      const { text } = await request(app.getHttpServer())
        .delete(`/car/${CAR_ID}`)
        .expect(HttpStatus.OK);

      expect(text).toEqual(RESPONSE);
    });

    it('should throw not found error if car does´nt exist', async () => {
      const CAR_ID = 999;

      const { body } = await request(app.getHttpServer())
        .delete(`/car/${CAR_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(CAR_ID));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
