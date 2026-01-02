import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtType } from '../types/JwtType';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const token = req.headers.authorization;
    if (token && token.split(' ')[0] === 'Bearer') {
      try {
        const payload: JwtType = await this.jwtService.verifyAsync(
          token.split(' ')[1],
        );
        if (!payload.isActive)
          throw new BadRequestException('Yor account is no longer active');

        req['user'] = payload;
        return true;
      } catch (err) {
        throw new UnauthorizedException();
      }
    }
    throw new UnauthorizedException();
  }
}
