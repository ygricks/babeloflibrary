import { Controller } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

describe('AuthorsController', () => {
  let controller: AuthorsController;

  const mockAuthor = {
    create: jest.fn((dto) => {
      return {
        _id: '' + Date.now(),
        ...dto,
      };
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
    findBooks: jest.fn((_id) => {
      return [];
    }),
    findOne: jest.fn((_id) => {
      return new Object();
    }),
    remove: jest.fn((_id) => {
      return Math.floor(Math.random() * 10) % 2 == 0;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [AuthorsService],
    })
      .overrideProvider(AuthorsService)
      .useValue(mockAuthor)
      .compile();

    controller = module.get<AuthorsController>(AuthorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const dto = {
    first_name: 'Ion',
    last_name: 'creanga',
    birthday: new Date('1837-04-01'),
  };

  it('should create a author', () => {
    expect(controller.create(dto)).toEqual({
      _id: expect.any(String),
      ...dto,
    });
  });

  it('should updape a author', () => {
    expect(controller.update('12', dto)).toEqual({
      _id: '12',
      ...dto,
    });
  });

  it('should findAll authors', () => {
    expect(controller.findAll()).toEqual(expect.any(Array));
  });

  it('should findBooks of author', () => {
    expect(controller.findBooks('11')).toEqual(expect.any(Array));
  });

  it('should findOne author', () => {
    expect(controller.findOne('11')).toEqual(expect.any(Object));
  });

  it('should remove author', () => {
    expect(controller.remove('11')).toEqual(expect.any(Boolean));
  });
});
