import { NotFoundException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import DBService, { Types } from 'src/db/services/db.service';
import {
  InputAlgorithmsPerPage,
  User,
  UserForAccountPage,
  AlgorithmsPerPage,
} from 'src/graphql_ts/graphql';
import { UtilsService } from 'src/utils/utils.service';
import { UpdateUserDTO } from '../dtos';
import { MyLogger } from '../../log/my-logger.service';

@Resolver('User')
export class UsersResolver {
  constructor(
    private readonly db: DBService,
    private readonly utils: UtilsService,
    private myLogger: MyLogger,
  ) {
    this.myLogger.setContext(UsersResolver.name);
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async users(): Promise<User[]> {
    return await this.utils.populateAllEntirely(
      await this.db.getAll(Types.User),
      Types.User,
    );
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async user(@Args('id') id: string): Promise<User> {
    return await this.utils.populateEntirely(
      await this.db.findById(id, Types.User),
      Types.User,
    );
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() current_user): Promise<User> {
    return await this.utils.populateEntirely(
      await this.db.findById(current_user._id, Types.User),
      Types.User,
    );
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async userAlgorithmsPerPage(
    @Args('input') input: InputAlgorithmsPerPage,
  ): Promise<AlgorithmsPerPage> {
    const allUsers = await this.db.getAll(Types.User);
    let user = allUsers.find((user) => user.nickname === input['nickname']);
    user = await this.utils.populateEntirely(
      await this.db.findById(user.id, Types.User),
      Types.User,
    );

    const allAlgosLength = user.allCreatedAlgorithms.length;

    const algorithms = user.allCreatedAlgorithms.slice(
      input['algosPerPage'] * (input['page'] - 1),
      input['algosPerPage'] * input['page'],
    );

    for (let i = 0; i < algorithms.length; i++) {
      algorithms[i] = await algorithms[i].populate('tags');
    }

    return {
      algorithms,
      allAlgosLength,
    };
  }

  @Query()
  @UseGuards(JwtAuthGuard)
  async userForAccountPage(
    @Args('nickname') nickname: string,
  ): Promise<UserForAccountPage> {
    const allUsers = await this.db.getAll(Types.User);
    let user = allUsers.find((user) => user.nickname === nickname);

    if (!user) {
      throw new NotFoundException('There is no user with this nickname');
    }

    user = await this.utils.populateEntirely(
      await this.db.findById(user.id, Types.User),
      Types.User,
    );

    const id = user.id;
    const nicknameTemp = user.nickname;
    const isAdmin = user.isAdmin;

    let totalLikes = 0;
    let totalDislikes = 0;
    user.allCreatedAlgorithms.forEach((algo) => {
      totalLikes += algo.likes;
      totalDislikes += algo.dislikes;
    });

    const lastAlgos = user.allCreatedAlgorithms
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 30);

    const allAlgosLength = user.allCreatedAlgorithms.length;
    let algosToNextLevel = 0;
    let nextLevelName = '';

    const allLevels = await this.db.getAll(Types.Level);
    const levelName = user.level ? user.level.name : allLevels[0].name;

    for (let i = 0; i < allLevels.length; i++) {
      if (allLevels[i].name == levelName && i + 1 < allLevels.length) {
        nextLevelName = allLevels[i + 1].name;
        algosToNextLevel = allLevels[i + 1].minAddedAlgorithms - allAlgosLength;
        break;
      }
    }

    let visitsPerDate = [];

    for (let i = 0; i < user.allCreatedAlgorithms.length; i++) {
      user.allCreatedAlgorithms[i] = await user.allCreatedAlgorithms[
        i
      ].populate('visiting');
    }

    user.allCreatedAlgorithms.forEach((algo) => {
      algo.visiting.forEach((visit) => {
        const dateFromString = new Date(visit.date);

        const idx = visitsPerDate.findIndex(
          (el) => el.date.getTime() === dateFromString.getTime(),
        );

        if (idx === -1) {
          visitsPerDate.push({
            date: dateFromString,
            visits: visit.visited,
          });
        } else {
          visitsPerDate[idx].visits += visit.visited;
        }
      });
    });

    visitsPerDate = visitsPerDate.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );

    let languagesDistribution = [];

    for (let i = 0; i < user.allCreatedAlgorithms.length; i++) {
      user.allCreatedAlgorithms[i] = await user.allCreatedAlgorithms[
        i
      ].populate('supportedLanguages');
      for (
        let j = 0;
        j < user.allCreatedAlgorithms[i].supportedLanguages.length;
        j++
      ) {
        user.allCreatedAlgorithms[i].supportedLanguages[j] =
          await user.allCreatedAlgorithms[i].supportedLanguages[j].populate(
            'tags',
          );
      }
    }

    user.allCreatedAlgorithms.forEach((algo) => {
      algo.supportedLanguages.forEach((language) => {
        const idx = languagesDistribution.findIndex(
          (el) => el.name === language.name,
        );

        if (idx === -1) {
          languagesDistribution.push({
            name: language.name,
            count: 1,
            percent: 0,
            color: language.tags[0].color,
          });
        } else {
          languagesDistribution[idx].count++;
        }
      });
    });

    languagesDistribution = this.largestRemainderRoundObject(
      languagesDistribution,
      'count',
      'percent',
      100,
      1,
    );

    return {
      id: id,
      nickname: nicknameTemp,
      isAdmin: isAdmin,
      levelName: levelName,
      totalLikes: totalLikes,
      totalDislikes: totalDislikes,
      lastAlgos: lastAlgos,
      allAlgosLength: allAlgosLength,
      algosToNextLevel: algosToNextLevel,
      nextLevelName: nextLevelName,
      visitsPerDate: visitsPerDate,
      languagesDistribution: languagesDistribution,
    };
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args('id') id: string,
    @Args('input') args: UpdateUserDTO,
  ): Promise<User> {
    return await this.utils.populateEntirely(
      await this.db.updateById(id, args, Types.User),
      Types.User,
    );
  }

  // Check Level not returns first time in GraphQL query
  @Mutation('changeUserLevel')
  @UseGuards(JwtAuthGuard)
  async changeUserLevel(
    @Args('levelId') levelId: string,
    @Args('userId') userId: string,
  ): Promise<User> {
    const user = await this.db.updateById(
      userId,
      { level: await this.db.findById(levelId, Types.Level) },
      Types.User,
    );
    return await this.utils.populateEntirely(user, Types.User);
  }

  @Mutation('deleteUser')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Args('id') id: string) {
    return await this.utils.populateEntirely(
      await this.db.updateById(
        id,
        {
          isDeleted: true,
          deleted_at: new Date(),
        },
        Types.User,
      ),
      Types.User,
    );
  }

  //! Work Admin Panel
  @Query()
  @UseGuards(JwtAuthGuard)
  async usersForAdminPanel() {
    const users = await this.db.getAll(Types.User);
    return users;
  }

  @Mutation('updateUserAdmin')
  @UseGuards(JwtAuthGuard)
  async updateUserAdmin(
    @Args('id') id: string,
    @Args('input') input: UpdateUserDTO,
  ): Promise<User> {
    try {
      const updatedUser = await this.db.updateUserAdmin(id, input);
      return updatedUser;
    } catch (err) {
      this.myLogger.error(err);
      return null;
    }
  }
  //! Work End

  private largestRemainderRoundObject(
    objArr,
    prop,
    spreadTo,
    desiredTotal,
    decimalNum,
  ) {
    if (!spreadTo) {
      spreadTo = prop + '_spread';
    }

    const numArr_spread = this.largestRemainderRound(
      objArr.map((item) => item[prop]),
      desiredTotal,
      decimalNum,
    );

    return objArr.map((item, index) => {
      item[spreadTo] = numArr_spread[index];
      return item;
    });
  }

  private largestRemainderRound(numbers, desiredTotal = 100, decimalNum = 0) {
    // if (decimalNum > 0) {
    //   const multiplier = Math.pow(10, decimalNum);
    //   //call the spread no decimal against multiplier of total seats
    //   const powSpread = this.largestRemainderRound(
    //     numbers,
    //     desiredTotal * multiplier,
    //     0,
    //   );
    //   return powSpread.map((e) => e / multiplier);
    // }

    if (numbers.length <= 0) {
      return [];
    }

    const multiplier = Math.pow(10, decimalNum);

    let total = 0;
    numbers.forEach((num) => {
      total += num;
    });
    numbers = numbers.map((num) => (num / total) * 100 * multiplier);
    desiredTotal *= multiplier;

    let result = numbers
      .map(function (number, index) {
        return {
          floor: Math.floor(number),
          remainder: getRemainder(number),
          index: index,
        };
      })
      .sort(function (a, b) {
        return b.remainder - a.remainder;
      });

    const lowerSum = result.reduce(function (sum, current) {
      return sum + current.floor;
    }, 0);

    const delta = desiredTotal - lowerSum;
    for (let i = 0; i < delta; i++) {
      result[i].floor++;
    }

    result = result
      .sort(function (a, b) {
        return a.index - b.index;
      })
      .map((e) => {
        return e.floor / multiplier;
      });

    return result;
  }
}
function getRemainder(number: any) {
  const remainder = number - Math.floor(number);
  return remainder.toFixed(4);
}
