import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UsersService } from '../users/users.service';
import { IMAGE_FIX_ACTION, USAGE_LIMITS } from './constants/usage.constants';
import { UsageLog, UsageLogDocument } from './schemas/usage-log.schema';

type UsageIdentity = {
  userId?: string;
  anonymousId?: string;
};

export type UsageStatusResponse = {
  plan: 'guest' | 'free' | 'pro';
  usedToday: number;
  dailyLimit: number;
  remainingToday: number;
};

@Injectable()
export class UsageService {
  constructor(
    @InjectModel(UsageLog.name)
    private readonly usageLogModel: Model<UsageLogDocument>,
    private readonly usersService: UsersService,
  ) {}

  async consumeImageFix(identity: UsageIdentity): Promise<UsageStatusResponse> {
    const status = await this.getImageFixStatus(identity);

    if (status.remainingToday <= 0) {
      throw new HttpException(
        'Daily image fix limit reached. Upgrade to Pro for a higher limit.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    await this.usageLogModel.create({
      action: IMAGE_FIX_ACTION,
      userId: identity.userId,
      anonymousId: identity.userId ? undefined : identity.anonymousId,
      dayKey: this.getDayKey(),
      plan: status.plan,
    });

    return {
      ...status,
      usedToday: status.usedToday + 1,
      remainingToday: status.remainingToday - 1,
    };
  }

  async getImageFixStatus(identity: UsageIdentity): Promise<UsageStatusResponse> {
    if (!identity.userId && !identity.anonymousId) {
      throw new BadRequestException('anonymousId is required for guest usage');
    }

    const plan = await this.resolvePlan(identity);
    const dailyLimit = USAGE_LIMITS[plan];
    const usedToday = await this.usageLogModel.countDocuments({
      action: IMAGE_FIX_ACTION,
      dayKey: this.getDayKey(),
      ...(identity.userId
        ? { userId: identity.userId }
        : { anonymousId: identity.anonymousId }),
    });

    return {
      plan,
      usedToday,
      dailyLimit,
      remainingToday: Math.max(dailyLimit - usedToday, 0),
    };
  }

  private async resolvePlan(
    identity: UsageIdentity,
  ): Promise<'guest' | 'free' | 'pro'> {
    if (!identity.userId) {
      return 'guest';
    }

    const user = await this.usersService.findById(identity.userId);

    return user.plan;
  }

  private getDayKey() {
    return new Date().toISOString().slice(0, 10);
  }
}
