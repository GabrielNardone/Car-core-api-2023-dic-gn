import { Base } from '@/common/domain/base.domain';
import { User } from '@/modules/user/domain/user.domain';

export class Document extends Base {
  url: string;
  src: string;
  description: string;
  title: string;
  user: User;
}
