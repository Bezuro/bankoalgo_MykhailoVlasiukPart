import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Level,
  User,
  Tag,
  Code,
  Step,
  Group,
  Algorithm,
  Language,
  Visit,
} from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Types from './types.enum';
import { MyLogger } from '../../log/my-logger.service';

@Injectable()
class DBService {
  constructor(
    @InjectModel('Level') private readonly levelModel: Model<Level>,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Tag') private readonly tagModel: Model<Tag>,
    @InjectModel('Code') private readonly codeModel: Model<Code>,
    @InjectModel('Step') private readonly stepModel: Model<Step>,
    @InjectModel('Group') private readonly groupModel: Model<Group>,
    @InjectModel('Algorithm') private readonly algorithmModel: Model<Algorithm>,
    @InjectModel('Language') private readonly languageModel: Model<Language>,
    @InjectModel('Visit') private readonly visitModel: Model<Visit>,
    private myLogger: MyLogger,
  ) {
    this.myLogger.setContext(DBService.name);
  }

  async insert(params: object, type: Types, only_id: boolean = false) {
    const model = this.getModelByType(type);
    const newModel = new model(params);
    const result = await newModel.save();

    if (only_id) return result.id as string;

    return result;
  }

  async updateById(
    _id: string,
    newItem: object,
    type: Types,
    only_id: boolean = false,
  ) {
    const item = await this.findById(_id, type);
    const updatedItem = Object.assign(item, newItem);
    updatedItem.save();

    if (only_id) return updatedItem.id as string;

    return updatedItem;
  }

  async existsByParams(params: object, type: Types) {
    const model = this.getModelByType(type);
    return await model.exists(params);
  }

  async existsById(_id: string, type: Types) {
    const model = this.getModelByType(type);
    return await model.exists({ _id });
  }

  async getAll(type: Types) {
    const model = this.getModelByType(type);
    return await model.find().exec();
  }

  async findById(id: string, type: Types): Promise<any> {
    const model = this.getModelByType(type);

    let item;
    try {
      item = await model.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('No such item');
    }
    if (!item) {
      throw new NotFoundException('No such item');
    }
    return item;
  }

  async removeById(_id: string, type: Types) {
    const model = this.getModelByType(type);
    const delItem = await this.findById(_id, type);
    const result = await model.deleteOne({ _id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Could not find such item');
    }

    return delItem;
  }

  async get(params: object, type: Types) {
    const model = await this.getModelByType(type);
    return await model.find(params).exec();
  }

  async getOne(params: object, type: Types) {
    const model = await this.getModelByType(type);
    return await model.findOne(params).exec();
  }

  async getDefaultGroup(): Promise<Group> {
    const model = await this.getModelByType(Types.Group);
    let default_group = await model.findOne({ name: 'DEFAULT' }).exec();

    if (!default_group) {
      default_group = await this.insert(
        { name: 'DEFAULT', showNumber: -1, isActive: false },
        Types.Group,
      );
    }

    return default_group;
  }

  public async addTagsToDB_and_Group(
    tags: any[],
    group: Group,
  ): Promise<Group> {
    for (let index = 0; index < tags.length; index++) {
      const tag = tags[index];
      const savedTag = await this.insert(tag, Types.Tag);
      await this.addTagToGroup(savedTag.id, group);
    }

    const newGroup = await this.findById(group.id, Types.Group);
    const pNewGroup = await newGroup.populate('tags');
    return pNewGroup;
  }

  // Check
  public async addTagToGroup(tagId: string, group: Group): Promise<Tag> {
    const tag = await this.findById(tagId, Types.Tag);

    // console.log(tag);
    // console.log('group' in tag && tag.group !== undefined && tag.group !== null);
    // console.log(tag.group);

    if ('group' in tag && tag.group !== undefined && tag.group !== null) {
      const pTag = await tag.populate('group');
      const _group = await pTag.group.populate('tags');
      const elements = _group.tags.filter((_tag) => _tag.id == tag.id);

      if (elements) {
        let index: number = _group.tags.findIndex((tag) => tag.id == tagId);
        if (index != -1) _group.tags.splice(index, 1);
        await _group.save();
      }
    }
    //

    if (!group.tags.includes(tag.id)) {
      group.tags.push(tag);
      await group.save();
    }

    const newTag = await this.updateById(tagId, { group: group }, Types.Tag);
    const pNewTag = await newTag.populate('group');
    return pNewTag;
  }

  public async deleteTag(id: string): Promise<Tag> {
    const groups = await this.getAll(Types.Group);

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

    return await this.removeById(id, Types.Tag);
  }

  //! Work
  //? Tags
  public async createTagAdmin(tag: any, userId: string): Promise<any> {
    tag.user = userId;

    const newTag = await this.tagModel.create(tag);

    await this.groupModel.findByIdAndUpdate(
      tag.group,
      { $push: { tags: newTag._id } },
      { new: true },
    );

    return newTag;
  }

  public async updateTagAdmin(tagId: string, tag: any): Promise<any> {
    const oldTag = await this.tagModel.findById(tagId);
    const updatedTag = await this.tagModel.findByIdAndUpdate(tagId, tag, {
      new: true,
    });

    if (!oldTag.group.equals(updatedTag.group)) {
      await this.groupModel.findByIdAndUpdate(
        oldTag.group,
        { $pull: { tags: oldTag._id } },
        { new: true },
      );

      await this.groupModel.findByIdAndUpdate(
        updatedTag.group,
        { $push: { tags: updatedTag._id } },
        { new: true },
      );
    }

    return updatedTag;
  }

  public async deleteTagAdmin(tagId: string): Promise<any> {
    const algoritmsWithReference = await this.algorithmModel
      .find({ tags: tagId })
      .exec();

    if (algoritmsWithReference.length) {
      throw new Error(
        'Can not delete tag: there is algorithm with reference to this tag',
      );
    }

    const deletedTag = await this.tagModel
      .findByIdAndDelete(tagId)
      .populate('group');

    if (deletedTag) {
      const groupId = deletedTag.group.id;

      await this.groupModel.findByIdAndUpdate(
        groupId,
        { $pull: { tags: tagId } },
        { new: true },
      );

      await this.languageModel.findOneAndUpdate(
        { tags: tagId },
        { $pull: { tags: tagId } },
        { new: true },
      );
    }

    return deletedTag;
  }

  public async freeTagsForLanguagesTable(): Promise<any> {
    const tags = await this.tagModel.find().exec();

    for (let i = 0; i < tags.length; i++) {
      tags[i] = await tags[i].populate('group');
    }

    const tagsWithLanguageGroup = tags.filter((tag) => {
      return tag.group.name.toLowerCase() === 'languages';
    });

    let tagsFromLanguages = [];
    const languages = await this.languageModel.find().exec();
    languages.forEach((lang) => {
      tagsFromLanguages = [...tagsFromLanguages, ...lang.tags];
    });

    const results = tagsWithLanguageGroup.filter(
      ({ id: id1 }) =>
        !tagsFromLanguages.some(({ _id: id2 }) => id2.equals(id1)),
    );

    return results;
  }

  //? Group
  public async updateGroupAdmin(groupId: string, group: any): Promise<any> {
    const updatedGroup = await this.groupModel.findByIdAndUpdate(
      groupId,
      group,
      {
        new: true,
      },
    );

    return updatedGroup;
  }

  public async deleteGroupAdmin(groupId: string): Promise<any> {
    const deletedGroup = await this.groupModel.findByIdAndDelete(groupId);

    const defaultGroup = await this.getDefaultGroup();

    await this.tagModel.updateMany(
      { group: groupId },
      { group: defaultGroup.id },
    );

    return deletedGroup;
  }

  //? User
  public async updateUserAdmin(userId: string, user: any): Promise<any> {
    const usersWithSameNicknameOrEmail = await this.userModel
      .find({ _id: { $ne: userId } })
      .find({
        $or: [{ email: user.email }, { nickname: user.nickname }],
      });

    if (usersWithSameNicknameOrEmail.length) return;

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, user, {
      new: true,
    });

    return updatedUser;
  }

  //? Language
  public async createLanguageAdmin(
    language: any,
    userId: string,
  ): Promise<any> {
    language.user = userId;
    language.created_at = Date.now();

    const newLanguage = await this.languageModel.create(language);

    return newLanguage;
  }

  public async updateLanguageAdmin(
    languageId: string,
    language: any,
  ): Promise<any> {
    language.updated_at = Date.now();

    const updatedLanguage = await this.languageModel.findByIdAndUpdate(
      languageId,
      language,
      {
        new: true,
      },
    );

    return updatedLanguage;
  }

  public async deleteLanguageAdmin(languageId: string): Promise<any> {
    const algosWithReference = await this.algorithmModel
      .find({ supportedLanguages: languageId })
      .exec();

    if (algosWithReference.length) return;

    const deletedLanguage = await this.languageModel.findByIdAndDelete(
      languageId,
    );

    return deletedLanguage;
  }

  //? Algorithm
  public async updateAlgorithmAdmin(
    algorithmId: string,
    algorithm: any,
  ): Promise<any> {
    const updatedLanguage = await this.algorithmModel.findByIdAndUpdate(
      algorithmId,
      algorithm,
      {
        new: true,
      },
    );

    return updatedLanguage;
  }

  //! Work End

  private getModelByType(type: Types): Model<any> {
    switch (type) {
      case Types.Level:
        return this.levelModel;
      case Types.User:
        return this.userModel;
      case Types.Tag:
        return this.tagModel;
      case Types.Code:
        return this.codeModel;
      // case Types.ExampleOfUse: return this.exampleOfUseModel;
      case Types.Step:
        return this.stepModel;
      case Types.Group:
        return this.groupModel;
      case Types.Algorithm:
        return this.algorithmModel;
      case Types.Language:
        return this.languageModel;
      case Types.Visit:
        return this.visitModel;
    }
  }
}

export default DBService;

export { Types };
