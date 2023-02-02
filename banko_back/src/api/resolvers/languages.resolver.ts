import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards';
import DBService, { Types } from 'src/db/services/db.service';
import { Language, UserFromJwt } from 'src/graphql_ts/graphql';
import { UtilsService } from 'src/utils/utils.service';
import { CreateLanguageDTO, UpdateLanguageDTO } from '../dtos';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { MyLogger } from '../../log/my-logger.service';

@Resolver('Language')
export class LanguagesResolver {
  constructor(
    private readonly db: DBService,
    private readonly utils: UtilsService,
    private myLogger: MyLogger,
  ) {
    this.myLogger.setContext(LanguagesResolver.name);
  }

  @Query()
  async languages() {
    return await this.utils.populateAllEntirely(
      await this.db.getAll(Types.Language),
      Types.Language,
    );
  }

  @Query()
  async language(@Args('id') id: string): Promise<Language> {
    return await this.utils.populateEntirely(
      await this.db.findById(id, Types.Language),
      Types.Language,
    );
  }

  @Mutation('createLanguage')
  @UseGuards(JwtAuthGuard)
  async createLanguage(
    @Args('input') args: CreateLanguageDTO,
  ): Promise<Language> {
    // Add tags to groups
    // if (this.utils.check('tags', args)) {
    //   const tags = args.tags;
    //   delete args.tags;
    //   args['created_at'] = new Date();
    //   let language = await this.db.insert(args, Types.Language);

    //   for (let index = 0; index < tags.length; index++) {
    //     const tag = tags[index];
    //     let savedTag = await this.db.insert(tag, Types.Tag);
    //     language.tags.push(savedTag);
    //     await language.save();
    //   }

    //   return await this.utils.populateEntirely(language, Types.Language);
    // }

    // return await this.utils.populateEntirely(
    //   await this.db.insert(args, Types.Group),
    //   Types.Language,
    // );

    return null;
  }

  @Mutation('deleteLanguage')
  @UseGuards(JwtAuthGuard)
  async deleteLanguage(@Args('id') id: string): Promise<Language> {
    return await this.utils.populateEntirely(
      await this.db.removeById(id, Types.Language),
      Types.Language,
    );
  }

  @Mutation('updateLanguage')
  @UseGuards(JwtAuthGuard)
  async updateLanguage(
    @Args('id') id: string,
    @Args('input') args: UpdateLanguageDTO,
  ): Promise<Language> {
    return await this.utils.populateEntirely(
      await this.db.updateById(id, args, Types.Language),
      Types.Language,
    );
  }

  @Mutation('addUserToLanguage')
  @UseGuards(JwtAuthGuard)
  async addUserToLanguage(
    @Args('userId') userId: string,
    @Args('langId') langId: string,
  ): Promise<Language> {
    const language = await this.db.updateById(
      langId,
      { user: await this.db.findById(userId, Types.User) },
      Types.Language,
    );
    return await this.utils.populateEntirely(language, Types.Language);
  }

  //! Work Admin Panel
  @Query()
  async languagesForAdminPanel() {
    const languages = await this.db.getAll(Types.Language);

    for (let i = 0; i < languages.length; i++) {
      languages[i] = await languages[i].populate('tags');
    }

    return languages;
  }

  @Mutation('createLanguageAdmin')
  @UseGuards(JwtAuthGuard)
  async createLanguageAdmin(
    @CurrentUser() user: UserFromJwt,
    @Args('input') input: CreateLanguageDTO,
  ): Promise<Language> {
    try {
      const newTag = await this.db.createLanguageAdmin(input, user._id);
      return newTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }

  @Mutation('updateLanguageAdmin')
  @UseGuards(JwtAuthGuard)
  async updateLanguageAdmin(
    @Args('id') id: string,
    @Args('input') input: UpdateLanguageDTO,
  ): Promise<Language> {
    try {
      const updatedTag = await this.db.updateLanguageAdmin(id, input);
      return updatedTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }

  @Mutation('deleteLanguageAdmin')
  @UseGuards(JwtAuthGuard)
  async deleteLanguageAdmin(@Args('id') id: string): Promise<Language> {
    try {
      const deletedTag = await this.db.deleteLanguageAdmin(id);
      return deletedTag;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }
  //! Work End
}
