import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Group } from 'src/graphql_ts/graphql';
import { CreateGroupDTO, UpdateGroupDTO } from '../dtos';
import DBService, { Types } from '../../db/services/db.service';
import { UtilsService } from 'src/utils/utils.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { MyLogger } from '../../log/my-logger.service';

@Resolver('Group')
export class GroupsResolver {
  constructor(
    private readonly db: DBService,
    private readonly utils: UtilsService,
    private myLogger: MyLogger,
  ) {
    this.myLogger.setContext(GroupsResolver.name);
  }

  @Query()
  async groups() {
    let groups = await this.db.getAll(Types.Group);
    groups = groups.filter(g => g.isActive && g?.tags.length > 0);
    if (groups && groups?.length > 0) {
      return await this.populateAllGroupsEntirely(
        groups
      );
    }
  }

  @Query()
  async group(@Args('id') id: string): Promise<Group> {
    return await this.populateGroupEntirely(
      await this.db.findById(id, Types.Group),
    );
  }

  @Mutation('createGroup')
  @UseGuards(JwtAuthGuard)
  async createGroup(@Args('input') args: CreateGroupDTO): Promise<Group> {
    // if (this.utils.check('tags', args)) {
    //   const tags = args.tags;
    //   delete args.tags;
    //   const group = await this.db.insert(args, Types.Group);
    //   const newGroup = await this.db.addTagsToDB_and_Group(tags, group);
    //   return await this.populateGroupEntirely(newGroup);
    // }

    // return await this.db.insert(args, Types.Group);
    return null;
  }

  @Mutation('deleteGroup')
  @UseGuards(JwtAuthGuard)
  async deleteGroup(@Args('id') id: string): Promise<Group> {
    // Finish with tags
    const group = await this.db.removeById(id, Types.Group);
    // const group = await this.db.findById(id, Types.Group);

    // Delete from tags
    const result = await this.db.get({ group: group.id }, Types.Tag);

    const default_group = await this.db.getDefaultGroup();

    for (let index = 0; index < result.length; index++) {
      const item = result[index];
      await this.db.updateById(item.id, { group: default_group }, Types.Tag);

      if (!default_group.tags.includes(item.id)) {
        default_group.tags.push(item);
        await default_group.save();
      }
    }

    return await this.populateGroupEntirely(group);
  }

  @Mutation('updateGroup')
  @UseGuards(JwtAuthGuard)
  async updateGroup(
    @Args('id') id: string,
    @Args('input') input: UpdateGroupDTO,
  ): Promise<Group> {
    return await this.populateGroupEntirely(
      await this.db.updateById(id, input, Types.Group),
    );
  }

  //! Work Admin Panel
  @Query()
  async groupsAdmin() {
    return await this.db.getAll(Types.Group);
  }

  @Query()
  async groupsPopulatedAdmin() {
    return await this.populateAllGroupsEntirely(
      await this.db.getAll(Types.Group),
    );
  }

  @Mutation('createGroupAdmin')
  @UseGuards(JwtAuthGuard)
  async createGroupAdmin(@Args('input') input: CreateGroupDTO): Promise<Group> {
    return await this.db.insert(input, Types.Group);
  }

  @Mutation('updateGroupAdmin')
  @UseGuards(JwtAuthGuard)
  async updateGroupAdmin(
    @Args('id') id: string,
    @Args('input') input: UpdateGroupDTO,
  ): Promise<Group> {
    try {
      const updatedGroup = await this.db.updateGroupAdmin(id, input);
      return updatedGroup;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }

  @Mutation('deleteGroupAdmin')
  @UseGuards(JwtAuthGuard)
  async deleteGroupAdmin(@Args('id') id: string): Promise<Group> {
    try {
      const deletedTag = await this.db.deleteGroupAdmin(id);
      return deletedTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }
  //! Work End

  private async populateAllGroupsEntirely(groups) {
    let result_groups = groups;

    for (let index in result_groups) {
      result_groups[index] = await this.populateGroupEntirely(
        result_groups[index],
      );
    }

    return result_groups;
  }

  private async populateGroupEntirely(group) {
    return await group.populate('tags');
  }
}
