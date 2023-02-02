import { IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { NewLevel, NewLevelWithNull } from 'src/graphql_ts/graphql';

export class CreateLevelDTO extends NewLevel {
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  minAddedAlgorithms: number;

  @IsInt()
  @Min(0)
  maxAddedAlgorithms: number;

  @IsNotEmpty()
  description: string;
}

export class UpdateLevelDTO extends NewLevelWithNull {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minAddedAlgorithms: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  maxAddedAlgorithms: number;

  @IsOptional()
  @IsNotEmpty()
  description: string;
}
