import { SetMetadata } from '@nestjs/common';
import { UserType } from '../types/userType';

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
