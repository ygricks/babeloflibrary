import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '../src/authors/entities/author.entity';
import { AuthorsModule } from '../src/authors/authors.module';
import { Book } from '../src/books/entities/book.entity';
import { ObjectID } from 'mongodb';

describe('Author Controller (e2e)', () => {
  let app: INestApplication;

  const dto = {
    first_name: 'Ion',
    last_name: 'Creanga',
    birthday: new Date('2000-01-01').toISOString(),
  };
  const mockAuthor = [dto];

  const mockAuthorRepository = {
    find: jest.fn().mockResolvedValue(mockAuthor),
    save: jest.fn().mockImplementation((author) =>
      Promise.resolve({
        _id: ObjectID('6181c1055738e7daf06d05ce'),
        ...author,
      }),
    ),
    findOne: jest.fn().mockImplementation((_id) =>
      Promise.resolve(
        _id
          ? {
              ...dto,
              _id: '6181c1055738e7daf06d05ce',
            }
          : false,
      ),
    ),
    delete: jest.fn().mockImplementation((_id) => {
      const message = new Object({ raw: { result: { rm: 1, do: 1 } } });
      return Promise.resolve(_id ? message : false);
    }),
  };

  const mockBookRepository = {
    find: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthorsModule],
    })
      .overrideProvider(getRepositoryToken(Author))
      .useValue(mockAuthorRepository)
      .overrideProvider(getRepositoryToken(Book))
      .useValue(mockBookRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/authors (GET)', () => {
    return request(app.getHttpServer())
      .get('/authors')
      .expect(200)
      .expect(mockAuthor);
  });

  it('/authors/_id getOne (GET)', () => {
    const wait_author = Object.assign({}, dto, {
      _id: '6181c1055738e7daf06d05ce',
    });
    return request(app.getHttpServer())
      .get('/authors/6181c1055738e7daf06d05ce')
      .expect(200)
      .expect(wait_author);
  });

  it('/authors/_id update (PATH)', () => {
    const name = { first_name: 'Yon' };
    const wait_author = Object.assign(
      {
        _id: '6181c1055738e7daf06d05ce',
      },
      dto,
      name,
    );
    return request(app.getHttpServer())
      .patch('/authors/6181c1055738e7daf06d05ce')
      .send(name)
      .expect(200)
      .expect(wait_author);
  });

  it('/authors (POST)', () => {
    return request(app.getHttpServer())
      .post('/authors')
      .send(mockAuthor[0])
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          _id: expect.any(String),
          ...dto,
        });
      });
  });

  it('/authors (POST) --> fail 400', () => {
    const author_dto = Object.assign({}, dto, {
      first_name: 'au',
      birthday: '',
    });
    return request(app.getHttpServer())
      .post('/authors')
      .send(author_dto)
      .expect('Content-Type', /json/)
      .expect(400, {
        statusCode: 400,
        message: [
          'first_name must be longer than or equal to 3 characters',
          'birthday must be a Date instance',
        ],
        error: 'Bad Request',
      });
  });

  it('/authors (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/authors/6181c1055738e7daf06d05ce')
      .expect('Content-Type', /json/)
      .expect(200, { rm: 1, do: 1 });
  });
});
