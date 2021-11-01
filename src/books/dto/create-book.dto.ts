import { IsNotEmpty, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({
    description: 'Book title',
    minLength: 3,
    maxLength: 100,
    type: 'string',
  })
  title: string;

  @IsNotEmpty()
  @Length(6, 100)
  @ApiProperty({
    description: 'Book unique IBAN, isbn?',
    minLength: 3,
    maxLength: 100,
    type: 'string',
  })
  iban: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Book publication date, iso-8601',
    format: 'YYYY-MM-DD',
    type: 'Date',
  })
  published_at: Date;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Book author ID',
    type: 'ObjectID.toString()',
  })
  author: string;
}
