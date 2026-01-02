import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtType } from '../types/JwtType';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const payload: JwtType = req['user'];
    return payload;
  },
);
