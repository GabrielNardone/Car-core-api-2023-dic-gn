import { SetMetadata } from '@nestjs/common';

import { Role } from '@/modules/user/domain/format.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...roles: Role[]) => {
  return SetMetadata(META_ROLES, roles);
};
