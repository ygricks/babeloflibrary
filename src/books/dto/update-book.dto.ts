import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { IsOptional } from 'class-validator';


export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsOptional()
    readonly title: string;

    @IsOptional()
    readonly iban: string;

    @IsOptional()
    readonly published_at: Date;

    @IsOptional()
    readonly author: string;
}
