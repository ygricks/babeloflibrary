import { IsNotEmpty, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({
    description: 'Author first name',
    minLength: 3,
    maxLength: 100,
    type: 'string',
  })
  first_name: string;

  @IsNotEmpty()
  @Length(3, 100)
  @ApiProperty({
    description: 'Author last name',
    minLength: 3,
    maxLength: 100,
    type: 'string',
  })
  last_name: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Author birthday, iso-8601',
    format: 'YYYY-MM-DD',
    type: 'Date',
  })
  birthday: Date;
}
