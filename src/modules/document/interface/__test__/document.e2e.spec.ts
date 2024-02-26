import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { join } from 'path';
import * as request from 'supertest';

import { loadFixtures } from '@data/util/loader';

import { AppModule } from '@/app.module';
import { MockGuard } from '@/common/mock/jwt-auth-guard.mock';
import { GlobalAuthGuard } from '@/modules/auth/interface/guard/auth.guard';
import { RoleGuard } from '@/modules/auth/interface/guard/roles.guard';

import { CreateDocumentDto } from '../../application/dto/create-document.dto';
import { UpdateDocumentDto } from '../../application/dto/update-document.dto';

describe('User - [/user]', () => {
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

  const handleNotFoundResponse = (documentId: number) => {
    return {
      error: `Not Found`,
      message: `Document with id ${documentId} not found`,
      statusCode: HttpStatus.NOT_FOUND,
    };
  };

  const expectedDocument = {
    id: expect.any(Number),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    url: expect.any(String),
    src: expect.any(String),
    description: expect.any(String),
    title: expect.any(String),
    user: expect.any(Object),
  };

  describe('Get all - [GET /document]', () => {
    it('should return an array of documents', async () => {
      const EXPECTED_LENGTH = 2;

      const { body } = await request(app.getHttpServer())
        .get('/document')
        .expect(HttpStatus.OK);

      const expectedDocuments = expect.arrayContaining([
        expect.objectContaining({ ...expectedDocument, id: 1 }),
        expect.objectContaining({ ...expectedDocument, id: 2 }),
      ]);

      expect(body).toEqual(expectedDocuments);
      expect(body).toHaveLength(EXPECTED_LENGTH);
    });
  });

  describe('Get one by id - [GET /document/:id', () => {
    it('should throw not found error if id doesn´t exist', async () => {
      const DOCUMENT_ID = 999;

      const { body } = await request(app.getHttpServer())
        .get(`/document/${DOCUMENT_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(DOCUMENT_ID));
    });

    it('should return the specified document', async () => {
      const DOCUMENT_ID = 1;

      const { body } = await request(app.getHttpServer())
        .get(`/document/${DOCUMENT_ID}`)
        .expect(HttpStatus.OK);

      expect(body).toEqual(
        expect.objectContaining({ ...expectedDocument, id: 1 }),
      );
    });
  });

  describe('Create - [POST /document]', () => {
    it('should create an document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        url: 'https://www.randmon-url.com',
        src: 'random-src/path/2',
        description: 'This is a randmon description',
        title: 'random-document-2',
        user: 1,
      };

      const { body } = await request(app.getHttpServer())
        .post('/document')
        .send(createDocumentDto)
        .expect(HttpStatus.CREATED);

      const expectedResponse = expect.objectContaining({
        ...expectedDocument,
        id: 3,
        title: 'random-document-2',
      });

      expect(body).toEqual(expectedResponse);
    });

    it('should throw bad request error if the user is missing', async () => {
      const createDocumentDto = {
        url: 'https://www.randmon-url.com',
        src: 'random-src/path/2',
        description: 'This is a randmon description',
        title: 'random-document-2',
      };

      const { body } = await request(app.getHttpServer())
        .post('/document')
        .send(createDocumentDto)
        .expect(HttpStatus.BAD_REQUEST);

      const expectedResponse = expect.objectContaining({
        error: `Bad Request`,
        message: [
          'user must be a number conforming to the specified constraints',
        ],
        statusCode: HttpStatus.BAD_REQUEST,
      });

      expect(body).toEqual(expectedResponse);
    });
  });

  describe('Update one by id - [PATCH /document/:id]', () => {
    const updateDocumentDto: UpdateDocumentDto = {
      src: 'random-src/path/5',
      description: 'This is a randmon description',
    };

    it('should update an document with specified values', async () => {
      const DOCUMENT_ID = 1;

      const { body } = await request(app.getHttpServer())
        .patch(`/document/${DOCUMENT_ID}`)
        .send(updateDocumentDto)
        .expect(HttpStatus.ACCEPTED);

      expect(body).toEqual(
        expect.objectContaining({
          ...updateDocumentDto,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          url: expect.any(String),
          title: expect.any(String),
          id: 1,
        }),
      );
    });

    it('should throw not found error if document does´nt exist', async () => {
      const DOCUMENT_ID = 999;

      const { body } = await request(app.getHttpServer())
        .patch(`/document/${DOCUMENT_ID}`)
        .send(updateDocumentDto)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(DOCUMENT_ID));
    });
  });

  describe('Delete one by id - [DELETE /document/:id]', () => {
    it('should delete the specified document', async () => {
      const DOCUMENT_ID = 1;
      const RESPONSE = 'true';

      const { text } = await request(app.getHttpServer())
        .delete(`/document/${DOCUMENT_ID}`)
        .expect(HttpStatus.OK);

      expect(text).toEqual(RESPONSE);
    });

    it('should throw not found error if document does´nt exist', async () => {
      const DOCUMENT_ID = 999;

      const { body } = await request(app.getHttpServer())
        .delete(`/document/${DOCUMENT_ID}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toEqual(handleNotFoundResponse(DOCUMENT_ID));
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
