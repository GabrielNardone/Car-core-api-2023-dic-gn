import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { Role } from '@/modules/user/domain/format.enum';
import { User } from '@/modules/user/domain/user.domain';

import { IS_PUBLIC_KEY } from '../decorator/public-route.decorator';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class GlobalAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublicRoute = this.getDecoratorMetadata<boolean>(
      context,
      IS_PUBLIC_KEY,
    );

    if (isPublicRoute) return true;

    try {
      await super.canActivate(context);
    } catch (error) {
      return false;
    }

    const validRoles: Role[] = this.reflector.getAllAndMerge(ROLES_KEY, [
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

  private getDecoratorMetadata<T>(context: ExecutionContext, key: string): T {
    return this.reflector.getAllAndOverride(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
