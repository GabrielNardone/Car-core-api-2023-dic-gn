import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class MockJwtAuthGuard implements CanActivate {
  canActivate(
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
