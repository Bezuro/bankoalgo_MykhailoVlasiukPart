import { IsNotEmpty, IsOptional } from 'class-validator';
import { NewLanguage, NewLanguageWithNull } from 'src/graphql_ts/graphql';

export class CreateLanguageDTO extends NewLanguage {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  tags: [string];
}

export class UpdateLanguageDTO extends NewLanguageWithNull {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  isActive: boolean;

  @IsOptional()
  @IsNotEmpty()
  tags: [string];
}
