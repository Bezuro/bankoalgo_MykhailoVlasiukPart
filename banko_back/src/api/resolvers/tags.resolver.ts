import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards';
import DBService, { Types } from 'src/db/services/db.service';
import { Tag, Language, UserFromJwt } from 'src/graphql_ts/graphql';
import { UtilsService } from 'src/utils/utils.service';
import { CreateTagDTO, UpdateTagDTO } from '../dtos';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { MyLogger } from '../../log/my-logger.service';

@Resolver('Tag')
export class TagsResolver {
  constructor(
    private readonly db: DBService,
    private readonly utils: UtilsService,
    private myLogger: MyLogger,
  ) {
    this.myLogger.setContext(TagsResolver.name);
  }

  @Query()
  async tags() {
    const tags = await this.db.getAll(Types.Tag);

    for (const index in tags) {
      tags[index] = await this.populateTagEntirely(tags[index]);

      if (!this.utils.check('group', tags[index])) {
        tags[index] = await this.db.updateById(
          tags[index].id,
          { group: await this.db.getDefaultGroup() },
          Types.Tag,
        );

        const default_group = await this.db.getDefaultGroup();

        if (!default_group.tags.includes(tags[index].id)) {
          default_group.tags.push(tags[index]);
          await default_group.save();
        }

        tags[index] = await this.populateTagEntirely(tags[index]);
      }
    }

    return tags;
  }

  @Query()
  async tag(@Args('id') id: string): Promise<Tag> {
    return await this.populateTagEntirely(
      await this.db.findById(id, Types.Tag),
    );
  }

  @Mutation('createTag')
  @UseGuards(JwtAuthGuard)
  async createTag(@Args('input') args: CreateTagDTO): Promise<Tag> {
    const newTag = await this.db.insert(args, Types.Tag);
    const default_group = await this.db.getDefaultGroup();
    if (!default_group.tags.includes(newTag.id)) {
      default_group.tags.push(newTag);
      await default_group.save();
    }
    return newTag;
  }

  @Mutation('addTagToGroup')
  @UseGuards(JwtAuthGuard)
  async addTagToGroup(
    @Args('tagId') tagId: string,
    @Args('groupId') groupId: string,
  ): Promise<Tag> {
    const group = await this.db.findById(groupId, Types.Group);
    const tag = await this.db.findById(tagId, Types.Tag);

    // If Target = Source return
    if (tag.group._id.toString() === groupId) {
      console.log('NO CHANGES');
      return await this.populateTagEntirely(tag);
    }

    // 1) Delete tag from Source
    const pTag = await this.populateTagEntirely(tag);
    const _group = await pTag.group.populate('tags');
    const elements = _group.tags.filter((_tag) => _tag.id == tag.id);

    if (elements) {
      let index: number = _group.tags.findIndex((tag) => tag.id == tagId);
      if (index != -1) _group.tags.splice(index, 1);
      await _group.save();
    }

    // 2) Add tag to Target
    if (!group.tags.includes(tag.id)) {
      group.tags.push(tag);
      await group.save();
    }

    // 3) Update tag with new group and return populated
    return await this.populateTagEntirely(
      await this.db.updateById(tagId, { group: group }, Types.Tag),
    );
  }

  @Mutation('addTagToLanguage')
  @UseGuards(JwtAuthGuard)
  async addTagToLanguage(
    @Args('tagId') tagId: string,
    @Args('langId') langId: string,
  ): Promise<Language> {
    const lang = await this.db.findById(langId, Types.Language);
    const tag = await this.db.findById(tagId, Types.Tag);

    if (!lang.tags.includes(tag.id)) {
      lang.tags.push(tag);
      return this.utils.populateEntirely(await lang.save(), Types.Language);
    }

    return this.utils.populateEntirely(lang, Types.Language);
  }

  @Mutation('deleteTagFromLanguage')
  @UseGuards(JwtAuthGuard)
  async deleteTagFromLanguage(
    @Args('tagId') tagId: string,
    @Args('langId') langId: string,
  ): Promise<Language> {
    const lang = await this.db.findById(langId, Types.Language);
    const tag = await this.db.findById(tagId, Types.Tag);

    if (lang.tags.includes(tag.id)) {
      let index: number = lang.tags.findIndex((tag) => tag.toString() == tagId);

      if (index != -1) {
        lang.tags.splice(index, 1);
        return this.utils.populateEntirely(await lang.save(), Types.Language);
      }
    }

    return this.utils.populateEntirely(lang, Types.Language);
  }

  // Should be optimized
  @Mutation('deleteTag')
  @UseGuards(JwtAuthGuard)
  async deleteTag(@Args('id') id: string): Promise<Tag> {
    const groups = await this.db.getAll(Types.Group);

    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];

      const pGroup = await group.populate('tags');
      const elements = pGroup.tags.filter((_tag) => _tag.id == id);

      if (elements) {
        let i: number = pGroup.tags.findIndex((tag) => tag.id == id);
        if (i != -1) pGroup.tags.splice(i, 1);
        await pGroup.save();
      }
    }

    return await this.db.removeById(id, Types.Tag);
  }

  @Mutation('updateTag')
  @UseGuards(JwtAuthGuard)
  async updateTag(
    @Args('id') id: string,
    @Args('input') input: UpdateTagDTO,
  ): Promise<Tag> {
    return await this.populateTagEntirely(
      await this.db.updateById(id, input, Types.Tag),
    );
  }

  @Mutation('deleteManyTags')
  @UseGuards(JwtAuthGuard)
  async deleteManyTags(@Args('ids') ids: string[]): Promise<boolean> {
    for (const id of ids) {
      await this.db.deleteTag(id);
    }
    return true;
  }

  //! Work Admin Panel
  @Query()
  async tagsForAdminPanel() {
    const tags = await this.db.getAll(Types.Tag);

    for (let i = 0; i < tags.length; i++) {
      tags[i] = await tags[i].populate('group');
      tags[i] = await tags[i].populate('user');
    }

    return tags;
  }

  @Query()
  async freeTagsForLanguagesTable() {
    try {
      const result = await this.db.freeTagsForLanguagesTable();
      return result;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }

  @Mutation('createTagAdmin')
  @UseGuards(JwtAuthGuard)
  async createTagAdmin(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateTagDTO,
  ): Promise<Tag> {
    try {
      const newTag = await this.db.createTagAdmin(input, user._id);
      return newTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }

  @Mutation('updateTagAdmin')
  @UseGuards(JwtAuthGuard)
  async updateTagAdmin(
    @Args('id') id: string,
    @Args('input') input: UpdateTagDTO,
  ): Promise<Tag> {
    try {
      const updatedTag = await this.db.updateTagAdmin(id, input);
      return updatedTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }

  @Mutation('deleteTagAdmin')
  @UseGuards(JwtAuthGuard)
  async deleteTagAdmin(@Args('id') id: string): Promise<Tag> {
    try {
      const deletedTag = await this.db.deleteTagAdmin(id);
      return deletedTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }
  //! Work End

  private async populateTagEntirely(tag) {
    return await tag.populate('group');
  }
}
