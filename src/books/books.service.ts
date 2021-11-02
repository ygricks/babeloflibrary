import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { MongoRepository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from '../authors/entities/author.entity';
import { ObjectID } from 'mongodb';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: MongoRepository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: MongoRepository<Author>,
  ) {}

  async create(createBookDto: CreateBookDto) {
    let _id = null;
    try {
      _id = ObjectID(createBookDto.author);
    } catch (error) {
      throw new BadRequestException('Error input data, incorect parameter id');
    }

    const author = await this.authorRepository.findOne({ _id });
    if (!author) {
      throw new BadRequestException("can't find the author");
    }

    const book = await this.bookRepository.findOne({
      where: {
        iban: { $eq: createBookDto.iban },
      },
    });
    if (book) {
      throw new BadRequestException('the book with same IBAN already exist');
    }

    return await this.bookRepository.save(createBookDto);
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOne(id: string) {
    let _id = null;
    try {
      _id = ObjectID(id);
    } catch (error) {
      throw new BadRequestException('Error input data, incorect parameter id');
    }
    return await this.bookRepository.findOne({ _id });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    let _id = null;
    try {
      _id = ObjectID(id);
    } catch (error) {
      throw new BadRequestException('Error input data, incorect parameter id');
    }
    const book = await this.bookRepository.findOne({ _id });
    if (!book) {
      throw new BadRequestException("can't find the book");
    }
    const updated = Object.assign(book, updateBookDto);
    return await this.bookRepository.save(updated);
  }

  async remove(id: string) {
    let _id = null;
    try {
      _id = ObjectID(id);
    } catch (error) {
      throw new BadRequestException('Error input data, incorect parameter id');
    }
    const deleted = await this.bookRepository.delete({ _id });
    return deleted?.raw?.result;
  }
}
