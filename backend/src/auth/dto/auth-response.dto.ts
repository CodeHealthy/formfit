import type { UserResponseDto } from '../../users/dto/user-response.dto';

export type AuthResponseDto = {
    accessToken: string;
    user: UserResponseDto;
};