import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { Role } from '@/modules/user/domain/format.enum';
import { User } from '@/modules/user/domain/user.domain';

import { META_ROLES } from '../decorator/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: Role[] = this.reflector.getAllAndMerge(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!validRoles || validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!validRoles.includes(user.role)) {
      throw new ForbiddenException(
        `User ${user.firstName} ${user.lastName} need a valid role: [${validRoles}]`,
      );
    }

    return true;
  }
}
