import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { ObjectID } from 'mongodb';

const dto = {
  first_name: 'Ion',
  last_name: 'Creanga',
  birthday: new Date('1837-04-01'),
};

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockAuthorProvider = {
    save: jest.fn().mockImplementation((author) =>
      Promise.resolve({
        _id: ObjectID('6181c1055738e7daf06d05ce'),
        ...author,
      }),
    ),
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([]);
    }),
    findOne: jest.fn().mockImplementation((__id) => {
      return Promise.resolve(Object.assign(new Author(), dto));
    }),
    delete: jest.fn().mockImplementation((_id) => {
      const message = new Object({ raw: { result: { rm: 1, do: 1 } } });
      return Promise.resolve(message);
    }),
  };
  const mockBookProvider = {
    find: jest.fn().mockImplementation(() => {
      return Promise.resolve([]);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockAuthorProvider,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookProvider,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and return Author record', async () => {
    expect(await service.create(dto)).toEqual({
      _id: expect.any(ObjectID),
      ...dto,
    });
  });

  it('should return all Authors', async () => {
    const a = await service.findAll();
    expect(await service.findAll()).toEqual(expect.any(Array));
  });

  it('should return one Author', async () => {
    const _id = ObjectID('6181c1055738e7daf06d05ce');
    expect(await service.findOne(_id)).toEqual(dto);
  });

  it('should return Author Books', async () => {
    const _id = ObjectID('6181c1055738e7daf06d05ce');
    expect(await service.findBooks(_id)).toEqual(expect.any(Array));
  });

  it('should remove Author', async () => {
    const _id = ObjectID('6181c1055738e7daf06d05ce');
    expect(await service.remove(_id)).toEqual(expect.any(Object));
  });
});
