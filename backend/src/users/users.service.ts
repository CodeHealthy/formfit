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