import { IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { NewGroup, NewGroupWithNull } from 'src/graphql_ts/graphql';

export class CreateGroupDTO extends NewGroup {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(-1)
  showNumber: number;

  @IsNotEmpty()
  isActive: boolean;
}

export class UpdateGroupDTO extends NewGroupWithNull {
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  @Min(-1)
  showNumber: number;

  @IsOptional()
  @IsNotEmpty()
  isActive: boolean;
}
