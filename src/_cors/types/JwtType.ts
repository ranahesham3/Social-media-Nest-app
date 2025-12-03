import { UserType } from './userType';

export type JwtType = {
  id: number;
  role: UserType;
  isActive: boolean;
};
