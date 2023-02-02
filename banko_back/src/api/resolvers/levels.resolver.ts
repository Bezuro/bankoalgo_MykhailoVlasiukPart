import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Level } from 'src/graphql_ts/graphql';
import { CreateLevelDTO, UpdateLevelDTO } from '../dtos';
import DBService, { Types } from '../../db/services/db.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';

@Resolver('Level')
export class LevelsResolver {
  constructor(private readonly db: DBService) {}

  @Query()
  async levels() {
    return this.db.getAll(Types.Level);
  }

  @Query()
  async level(@Args('id') id: string): Promise<Level> {
    return await this.db.findById(id, Types.Level);
  }

  @Mutation('createLevel')
  @UseGuards(JwtAuthGuard)
  async createLevel(@Args('input') args: CreateLevelDTO): Promise<Level> {
    return await this.db.insert(args, Types.Level);
  }

  @Mutation('updateLevel')
  @UseGuards(JwtAuthGuard)
  async updateLevel(
    @Args('id') id: string,
    @Args('input') args: UpdateLevelDTO,
  ): Promise<Level> {
    return await this.db.updateById(id, args, Types.Level);
  }

  @Mutation('deleteLevel')
  @UseGuards(JwtAuthGuard)
  async deleteLevel(@Args('id') id: string): Promise<Level> {
    return await this.db.removeById(id, Types.Level);
  }
}
