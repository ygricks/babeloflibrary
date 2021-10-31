import { PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';
import { IsOptional } from 'class-validator';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
    @IsOptional()
    readonly first_name: string;

    @IsOptional()
    readonly last_name: string;

    @IsOptional()
    readonly birthday: Date;
}
