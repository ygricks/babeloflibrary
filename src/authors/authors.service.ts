import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { MongoRepository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Book } from 'src/books/entities/book.entity';
import { ObjectID } from 'mongodb';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: MongoRepository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: MongoRepository<Author>
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return await this.authorRepository.save(createAuthorDto);
  }

  async findAll() {
    return await this.authorRepository.find();
  }

  async findOne(id: string) {
    let _id = null;
    try{
      _id = ObjectID(id);
    }catch(error){
      throw new BadRequestException("Error input data, incorect parameter id");
    }
    return await this.authorRepository.findOne({_id})
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    let _id = null;
    try{
      _id = ObjectID(id);
    }catch(error){
      throw new BadRequestException("Error input data, incorect parameter id");
    }

    let author = await this.authorRepository.findOne({_id});
    if(!author) {
      throw new BadRequestException("can't find the author");
    }
    let updated = Object.assign(author, updateAuthorDto);
    return await this.authorRepository.save(updated);
  }

  async remove(id: string) {
    let _id = null;
    try{
      _id = ObjectID(id);
    }catch(error){
      throw new BadRequestException("Error input data, incorect parameter id");
    }

    const books = await this.bookRepository.find({
      where: {
        author: {$eq: _id.toString()},
      }
    });
    if(books.length) {
      throw new BadRequestException("At first, remove the author books");
    }
    let deleted = await this.authorRepository.delete({_id});
    return deleted?.raw?.result;
  }

  async findBooks(id: string) {
    let _id = null;
    try{
      _id = ObjectID(id);
    }catch(error){
      throw new BadRequestException("Error input data, incorect parameter id");
    }
    return await this.bookRepository.find({
      where: {
        author: {$eq: _id.toString()},
      }
    });
  }
}
