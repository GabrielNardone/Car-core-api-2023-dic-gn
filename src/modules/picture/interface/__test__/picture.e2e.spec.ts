import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';
import { FILE_UPLOAD_REPOSITORY } from '@/common/application/repository/file-upload.repository.interface';
import { MockGuard } from '@/common/mock/jwt-auth-guard.mock';
import { GlobalAuthGuard } from '@/modules/auth/interface/guard/auth.guard';

import { CarPicture } from '../../domain/car-picture.enum';

const mockedUploadService = {
  uploadFiles: jest.fn(),
};

describe('Picture - [/picture]', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(FILE_UPLOAD_REPOSITORY)
      .useValue(mockedUploadService)
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

  afterEach(async () => {
    jest.clearAllMocks();
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
    title: expect.any(String),
    description: expect.any(String),
    src: expect.any(String),
    type: expect.any(String),
    date: expect.any(String),
  };

  describe('Create - [POST /picture]', () => {
    const MOCK_UPLOAD_FILE_RESULT = 'http://www.amazon.ue/us-east-1/uuid';

    it('should create a picture', async () => {
      jest
        .spyOn(mockedUploadService, 'uploadFiles')
        .mockResolvedValueOnce(MOCK_UPLOAD_FILE_RESULT);

      const { body } = await request(app.getHttpServer())
        .post('/picture/car/1')
        .field('description', 'Some random description')
        .field('title', 'random3')
        .field('type', CarPicture.SIDE)
        .field('date', '2000-01-02')
        .attach('file', `${__dirname}/images/car2.jpg`)
        .expect(HttpStatus.CREATED);

      const expectedResponse = expect.objectContaining({
        ...expectedPicture,
        id: 3,
        title: 'random3',
      });

      expect(body).toEqual(expectedResponse);
    });

    it('should throw bad request error if description length is lower than 3', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/picture/car/1')
        .field('description', 'So')
        .field('title', 'random title')
        .field('type', CarPicture.SIDE)
        .field('date', '2000-01-02')
        .attach('file', `${__dirname}/images/car2.jpg`)
        .expect(HttpStatus.BAD_REQUEST);

      const expectedResponse = expect.objectContaining({
        error: `Bad Request`,
        message: ['description must be longer than or equal to 3 characters'],
        statusCode: HttpStatus.BAD_REQUEST,
      });

      expect(body).toEqual(expectedResponse);
    });
  });

  describe('Delete one by id - [DELETE /picture/:id]', () => {
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
