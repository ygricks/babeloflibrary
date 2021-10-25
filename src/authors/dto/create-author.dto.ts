import { IsNotEmpty, Length, IsDate } from 'class-validator';

export class CreateAuthorDto {
    @IsNotEmpty({ message: "you missed first name"})
    @Length(3,100)
    first_name: string;

    
    @IsNotEmpty()
    @Length(3,100)
    last_name: string;


    @IsDate()
    Birthday: Date;
}
