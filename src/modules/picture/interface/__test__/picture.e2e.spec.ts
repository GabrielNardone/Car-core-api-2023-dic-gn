import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';

import { CreatePictureDto } from '../../application/dto/create-picture.dto';
import { CarPicture } from '../../domain/car-picture.enum';

describe('Picture - [/picture]', () => {
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

  const handleNotFoundResponse = (pictureId: number) => {
    return {
      error: `Not Found`,
      message: `Picture with id ${pictureId} not found`,
      statusCode: HttpStatus.NOT_FOUND,
    };
  };

  const expectedPicture = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    car: expect.any(Number),
    src: expect.any(String),
    description: expect.any(String),
    title: expect.any(String),
    type: expect.any(String),
    date: expect.any(String),
  };

  describe.skip('Get one by id - [GET /picture/:id', () => {
    it('should throw not found error if id doesn´t exist', async () => {
      const PICTURE_ID = 999;

      const { body } = await request(app.getHttpServer())
        .get(`/picture/${PICTURE_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(PICTURE_ID));
    });

    it('should return the specified picture', async () => {
      const PICTURE_ID = 1;

      const { body } = await request(app.getHttpServer())
        .get(`/picture/${PICTURE_ID}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(
        expect.objectContaining({ ...expectedPicture, id: 1 }),
      );
    });
  });

  describe.skip('Create - [POST /picture]', () => {
    const createPictureDto: CreatePictureDto = {
      car: 1,
      description: 'random2',
      title: 'random3',
      type: CarPicture.FRONT,
      date: new Date('1993-01-02'),
    };

    it('should create a picture', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/picture')
        .send(createPictureDto)
        .expect(HttpStatus.CREATED);

      const expectedResponse = expect.objectContaining({
        ...expectedPicture,
        id: 3,
        title: 'random3',
      });

      expect(body).toEqual(expectedResponse);
    });

    it('should throw bad request error if description length is lower than 3', async () => {
      const createWrongPictureDto: CreatePictureDto = {
        ...createPictureDto,
        description: 'be',
      };

      const { body } = await request(app.getHttpServer())
        .post('/car')
        .send(createWrongPictureDto)
        .expect(HttpStatus.BAD_REQUEST);

      const expectedResponse = expect.objectContaining({
        error: `Bad Request`,
        message: ['/*************/'],
        statusCode: HttpStatus.BAD_REQUEST,
      });

      expect(body).toEqual(expectedResponse);
    });
  });

  describe.skip('Delete one by id - [DELETE /picture/:id]', () => {
    it('should delete the specified picture', async () => {
      const PICTURE_ID = 1;
      const RESPONSE = 'true';

      const { text } = await request(app.getHttpServer())
        .delete(`/car/${PICTURE_ID}`)
        .expect(HttpStatus.OK);

      expect(text).toEqual(RESPONSE);
    });

    it('should throw not found error if picture does´nt exist', async () => {
      const PICTURE_ID = 999;

      const { body } = await request(app.getHttpServer())
        .delete(`/picture/${PICTURE_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(PICTURE_ID));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
