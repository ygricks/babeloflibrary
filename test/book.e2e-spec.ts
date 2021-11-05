import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from '../src/authors/entities/author.entity';
import { Book } from '../src/books/entities/book.entity';
import { BooksModule } from '../src/books/books.module';

import { ObjectID } from 'mongodb';

describe('Book Controller (e2e)', () => {
  let app: INestApplication;

  const dto = {
    title: 'abecedar',
    iban: 'e7ua9o8e7u89aeo8u7',
    published_at: new Date('2000-03-03').toISOString(),
    author: '6181c1055738e7daf06d05ce',
  };
  const mockBook = [dto];

  const mockBookRepository = {
    find: jest.fn().mockResolvedValue(mockBook),
    save: jest.fn().mockImplementation((book) =>
      Promise.resolve({
        _id: ObjectID('6181c1055738e7daf06d05ce'),
        ...book,
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

  const mockAuthorRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ first_name: 'Ion' }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BooksModule],
    })
      .overrideProvider(getRepositoryToken(Book))
      .useValue(mockBookRepository)
      .overrideProvider(getRepositoryToken(Author))
      .useValue(mockAuthorRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect(mockBook);
  });

  it('/books/_id getOne (GET)', () => {
    const wait_book = Object.assign({}, dto, {
      _id: '6181c1055738e7daf06d05ce',
    });
    return request(app.getHttpServer())
      .get('/books/6181c1055738e7daf06d05ce')
      .expect(200)
      .expect(wait_book);
  });

  it('/books/_id update (PATH)', () => {
    const changes = { title: 'Abecedar NEW', iban: '777777777777' };
    const wait_book = Object.assign(
      {
        _id: '6181c1055738e7daf06d05ce',
      },
      dto,
      changes,
    );
    return request(app.getHttpServer())
      .patch('/books/6181c1055738e7daf06d05ce')
      .send(changes)
      .expect(200)
      .expect(wait_book);
  });

  it('/books (POST) --> fail 400', () => {
    const book_dto = Object.assign({}, dto, {
      title: 'au',
      iban: '',
    });
    return request(app.getHttpServer())
      .post('/books')
      .send(book_dto)
      .expect('Content-Type', /json/)
      .expect(400, {
        statusCode: 400,
        message: [
          'title must be longer than or equal to 3 characters',
          'iban must be longer than or equal to 6 characters',
          'iban should not be empty',
        ],
        error: 'Bad Request',
      });
  });

  it('/books (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/books/6181c1055738e7daf06d05ce')
      .expect('Content-Type', /json/)
      .expect(200, { rm: 1, do: 1 });
  });
});
