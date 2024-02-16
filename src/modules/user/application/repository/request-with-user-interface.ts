import { Request } from 'express';

import { User } from '../../domain/user.domain';

export interface RequestWithUser extends Request {
  user: User;
}
