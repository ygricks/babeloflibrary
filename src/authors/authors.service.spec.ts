import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthorsService } from './authors.service';
import { Author } from './entities/author.entity';
import { Book } from '../books/entities/book.entity';
import { ObjectID } from 'mongodb';

describe('AuthorsService', () => {
  let service: AuthorsService;

  const mockAuthorProvider = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((author) =>
      Promise.resolve({
        _id: ObjectID('6181c1055738e7daf06d05ce'),
        ...author,
      }),
    ),
  };
  const mockBookProvider = {};

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

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  const dto = {
    first_name: 'Ion',
    last_name: 'creanga',
    birthday: new Date('1837-04-01'),
  };

  it('should create and return Author record', async () => {
    expect(await service.create(dto)).toEqual({
      _id: expect.any('ObjectID'),
      ...dto,
    });
  });
});
