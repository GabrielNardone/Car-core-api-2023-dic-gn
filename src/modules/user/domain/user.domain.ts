import { Base } from '@/common/domain/base.domain';
import { Document } from '@/modules/document/domain/document.domain';

import { Role } from './format.enum';

export class User extends Base {
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  address: string;
  country: string;
  role?: Role;
  externalId?: string;
  document?: Document[];
}
