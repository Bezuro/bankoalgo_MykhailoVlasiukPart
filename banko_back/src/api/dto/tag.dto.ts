import { IsNotEmpty, IsOptional } from 'class-validator';
import { NewTag, NewTagWithNull } from 'src/graphql_ts/graphql';

export class CreateTagDTO extends NewTag {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  group: string;

  @IsNotEmpty()
  isActive: boolean;
}

export class UpdateTagDTO extends NewTagWithNull {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @IsNotEmpty()
  group: string;

  @IsOptional()
  @IsNotEmpty()
  isActive: boolean;
}
