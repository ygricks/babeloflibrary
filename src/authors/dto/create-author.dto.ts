import { IsNotEmpty, Length, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthorDto {
    @IsNotEmpty()
    @Length(3,100)
    first_name: string;

    @IsNotEmpty()
    @Length(3,100)
    last_name: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    birthday: Date;
}
