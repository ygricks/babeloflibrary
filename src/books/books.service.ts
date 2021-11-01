import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { MongoRepository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Author } from 'src/authors/entities/author.entity';
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
    let author = null;

    try {
      const _id = ObjectID(createBookDto.author);
      author = await this.authorRepository.findOne({ _id });
    } catch (error) {
      author = false;
    }
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

  async findOne(id: number) {
    const _id = ObjectID(id);
    return await this.bookRepository.findOne({ _id });
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const _id = ObjectID(id);
    const book = await this.bookRepository.findOne({ _id });
    if (!book) {
      throw new BadRequestException("can't find the book");
    }
    const updated = Object.assign(book, updateBookDto);
    return await this.bookRepository.save(updated);
  }

  async remove(id: number) {
    const _id = ObjectID(id);
    const deleted = await this.bookRepository.delete({ _id });
    return deleted?.raw?.result;
  }
}
