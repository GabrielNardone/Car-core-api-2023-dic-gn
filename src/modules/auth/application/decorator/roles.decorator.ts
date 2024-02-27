import { SetMetadata } from '@nestjs/common';

import { Role } from '@/modules/user/domain/format.enum';

export const ROLES_KEY = 'roles';

export const RoleProtected = (...roles: Role[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
