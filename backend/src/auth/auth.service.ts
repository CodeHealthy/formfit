import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import type { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async signup(dto: SignupDto): Promise<AuthResponseDto> {
        const saltRounds = Number(
            this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS'),
        );

        if (Number.isNaN(saltRounds) || saltRounds <= 0) {
            throw new Error('BCRYPT_SALT_ROUNDS must be a valid positive number');
        }

        const passwordHash = await bcrypt.hash(dto.password, saltRounds);

        const user = await this.usersService.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });

        return {
            accessToken: await this.createAccessToken({
                sub: user.id,
                email: user.email,
            }),
            user: this.usersService.toResponse(user),
        };
    }

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const passwordMatches = await bcrypt.compare(
            dto.password,
            user.passwordHash,
        );

        if (!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return {
            accessToken: await this.createAccessToken({
                sub: user.id,
                email: user.email,
            }),
            user: this.usersService.toResponse(user),
        };
    }

    async getMe(userId: string) {
        const user = await this.usersService.findById(userId);

        return this.usersService.toResponse(user);
    }

    private createAccessToken(payload: JwtPayload) {
        return this.jwtService.signAsync(payload);
    }
}