import { IsNotEmpty, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Author } from 'src/authors/entities/author.entity';

export class CreateBookDto {
    @IsNotEmpty()
    @Length(3,100)
    title: string;

    @IsNotEmpty()
    @Length(6,100)
    iban: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    published_at: Date;

    @IsNotEmpty()
    author: string;
}
