import { PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {
    readonly first_name: string;
    readonly last_name: string;
    readonly birthday: Date;
}
