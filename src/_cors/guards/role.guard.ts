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
import { Reflector } from '@nestjs/core';
import { UserType } from '../types/userType';
import { ResourceService } from 'src/resource/resource.service';
import { ResourceType } from '../types/ResourceType';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly resourceService: ResourceService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    const resourceType: ResourceType | null = this.extractResource(req.path);
    if (!resourceType) throw new BadRequestException('ResourceType not found');

    const roles: string[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const token = req.headers.authorization;
    if (token && token.split(' ')[0] === 'Bearer') {
      try {
        const payload: JwtType = await this.jwtService.verifyAsync(
          token.split(' ')[1],
        );
        if (!payload.isActive)
          throw new BadRequestException('Yor account is no longer active');

        if (!roles || roles.length === 0) {
          req['user'] = payload;
          return true;
        }
        if (roles.includes(payload.role) && payload.role === UserType.ADMIN) {
          req['user'] = payload;
          return true;
        }
        if (
          roles.includes(payload.role) &&
          payload.role === UserType.NORMAL_USER
        ) {
          const resourceOfUser = await this.resourceService.getResource(
            resourceType,
            parseInt(req.params.id),
          );
          console.log(resourceOfUser);

          if (resourceOfUser === payload.id) {
            req['user'] = payload;
            return true;
          }
        }
      } catch (err) {
        console.log(err);
        throw new UnauthorizedException();
      }
    }
    throw new UnauthorizedException();
  }

  private extractResource(path: string): ResourceType | null {
    const paths: string[] = path.split('/');
    let resourceType: string;
    if (paths.length > 3) resourceType = paths[3];
    switch (resourceType!) {
      case 'users': {
        return ResourceType.User;
      }
      case 'posts': {
        return ResourceType.POST;
      }
      case 'comments': {
        return ResourceType.COMMENT;
      }
      default: {
        return null;
      }
    }
  }
}
