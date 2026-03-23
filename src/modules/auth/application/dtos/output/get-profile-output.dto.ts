import { User } from '@auth-module/domain/entities/user';

export type GetProfileOutputDTO = { profile: { user: User } };
