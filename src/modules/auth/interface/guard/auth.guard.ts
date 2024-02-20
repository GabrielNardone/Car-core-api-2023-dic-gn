import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '../decorator/public-route.decorator';

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

    if (isPublicRoute) {
      return true;
    }

    try {
      await super.canActivate(context);
      return true;
    } catch (error) {
      return false;
    }
  }

  private getDecoratorMetadata<T>(context: ExecutionContext, key: string): T {
    return this.reflector.getAllAndOverride(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
