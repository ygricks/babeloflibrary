import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from './books.service';
import { Author } from '../authors/entities/author.entity';
import { Book } from './entities/book.entity';
import { ObjectID } from 'mongodb';

const dto = {
  title: 'abecedar',
  iban: 'a7oe80u7a0o',
  published_at: new Date('2000-03-03'),
  author: '6181c1055738e7daf06d05ce',
};

describe('BooksService', () => {
  let service: BooksService;
  const mockBookProvider = {
    save: jest.fn().mockImplementation((book) =>
      Promise.resolve({
        _id: ObjectID('6181c1055738e7daf06d05ce'),
        ...book,
      }),
    ),
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([]);
    }),
    findOne: jest.fn().mockImplementation((...params) => {
      return Promise.resolve(Object.assign(new Book(), dto));
    }),
    delete: jest.fn().mockImplementation((__id) => {
      const message = new Object({ raw: { result: { rm: 1, do: 1 } } });
      return Promise.resolve(message);
    }),
  };
  const mockAuthorProvider = {
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([]);
    }),

    findOne: jest.fn().mockImplementation((...params) => {
      return Promise.resolve(
        Object.assign(new Author(), { first_name: 'Ion' }),
      );
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookProvider,
        },
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorProvider,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // can't situ
  // it('should create and return Book record', async () => {
  //   expect(await service.create(dto)).toEqual({
  //     _id: expect.any(ObjectID),
  //     ...dto,
  //   });
  // });

  it('should return all Books', async () => {
    const a = await service.findAll();
    expect(await service.findAll()).toEqual(expect.any(Array));
  });

  it('should return one Book', async () => {
    const _id = ObjectID('6181c1055738e7daf06d05ce');
    expect(await service.findOne(_id)).toEqual(dto);
  });

  it('should remove Book', async () => {
    const _id = ObjectID('6181c1055738e7daf06d05ce');
    expect(await service.remove(_id)).toEqual(expect.any(Object));
  });
});
