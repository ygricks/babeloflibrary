import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBook = {
    create: jest.fn((dto) => {
      return {
        _id: '' + Date.now(),
        ...dto,
      };
    }),
    findOne: jest.fn((_id) => {
      return _id ? new Object() : false;
    }),
    update: jest.fn((id, dto) => {
      return {
        _id: id,
        ...dto,
      };
    }),
    findAll: jest.fn(() => {
      return [];
    }),
    remove: jest.fn((_id) => {
      const rand = Math.random() < 0.5;
      return _id ? rand : false;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService],
    })
      .overrideProvider(BooksService)
      .useValue(mockBook)
      .compile();

    controller = module.get<BooksController>(BooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const dto = {
    title: 'the war and peace',
    iban: '023847520',
    published_at: new Date('1777-07-07'),
    author: '200',
  };

  it('should create a book', () => {
    expect(controller.create(dto)).toEqual({
      _id: expect.any(String),
      ...dto,
    });
  });

  it('should findOne book', () => {
    expect(controller.findOne('11')).toEqual(expect.any(Object));
  });

  it('should updape a book', () => {
    expect(controller.update('23', dto)).toEqual({
      _id: '23',
      ...dto,
    });
  });

  it('should findAll books', () => {
    expect(controller.findAll()).toEqual(expect.any(Array));
  });

  it('should remove a book', () => {
    expect(controller.remove('11')).toEqual(expect.any(Boolean));
  });
});
