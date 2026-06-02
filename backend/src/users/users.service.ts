import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserResponseDto } from './dto/user-response.dto';

type CreateUserInput = {
    name: string;
    email: string;
    passwordHash: string;
};

type UpdateBillingStateInput = {
    plan?: UserDocument['plan'];
    stripeCustomerId?: string | null;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async create(input: CreateUserInput): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({
            email: input.email.toLowerCase(),
        });

        if (existingUser) {
            throw new ConflictException('An account with this email already exists');
        }

        return this.userModel.create({
            name: input.name,
            email: input.email.toLowerCase(),
            passwordHash: input.passwordHash,
            role: 'user',
            plan: 'free',
        });
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({
            email: email.toLowerCase(),
        });
    }

    async findById(id: string): Promise<UserDocument> {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async updateBillingState(
        id: string,
        input: UpdateBillingStateInput,
    ): Promise<UserDocument> {
        const update: Partial<Pick<User, 'plan' | 'stripeCustomerId'>> = {};

        if (input.plan) {
            update.plan = input.plan;
        }

        if (input.stripeCustomerId !== undefined) {
            update.stripeCustomerId = input.stripeCustomerId ?? undefined;
        }

        const user = await this.userModel.findByIdAndUpdate(id, update, {
            new: true,
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByStripeCustomerId(
        stripeCustomerId: string,
    ): Promise<UserDocument | null> {
        return this.userModel.findOne({ stripeCustomerId });
    }

    toResponse(user: UserDocument): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            plan: user.plan,
        };
    }
}
