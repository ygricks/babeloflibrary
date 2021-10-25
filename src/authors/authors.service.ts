import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Repository, MongoRepository } from 'typeorm';
import { Author } from './entities/author.entity';
import { ObjectID } from 'mongodb';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    // private authorRepository: Repository<Author>,
    private readonly authorRepository: MongoRepository<Author>
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    return await this.authorRepository.save(createAuthorDto);
    // return 'This action adds a new author';
  }

  async findAll() {
    return await this.authorRepository.find();
    // return `This action returns all authors`;
  }

  async findOne(id: string) {
    const _id = ObjectID(id);
    return await this.authorRepository.findOne({_id})
    // return `This action returns a #${id} author`;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const _id = ObjectID(id);
    let author = await this.authorRepository.findOne({_id});
    let updated = Object.assign(author, updateAuthorDto);
    return await this.authorRepository.save(updated);
    // return `This action updates a #${id} author`;
  }

  async remove(id: string) {
    const _id = ObjectID(id);
    let deleted = await this.authorRepository.delete({_id});
    return deleted?.raw?.result;

    // return `This action removes a #${id} author`;
  }
}
