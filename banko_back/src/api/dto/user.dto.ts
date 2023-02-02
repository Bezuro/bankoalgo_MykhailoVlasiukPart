import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { NewUser, NewUserWithNull } from 'src/graphql_ts/graphql';
import { AlgorithmDTO, CreateLevelDTO } from '../dtos';

export class UserDTO extends NewUser {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password is too short',
  })
  password: string;

  isAdmin: boolean;

  isBanned: boolean;

  isDeleted: boolean;

  allCreatedAlgorithms: AlgorithmDTO[];

  created_at: Date;

  updated_at: Date;

  deleted_at: Date;

  level: CreateLevelDTO;
}

export class UpdateUserDTO extends NewUserWithNull {
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  nickname: string;

  @IsOptional()
  @IsNotEmpty()
  isAdmin: boolean;

  @IsOptional()
  @IsNotEmpty()
  isBanned: boolean;
}
