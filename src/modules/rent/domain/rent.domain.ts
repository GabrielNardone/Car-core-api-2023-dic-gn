import { Base } from '@/common/domain/base.domain';
import { Car } from '@/modules/car/domain/car.domain';
import { User } from '@/modules/user/domain/user.domain';

export class Rent extends Base {
  car: Car;
  pricePerDay: number;
  user: User;
  admin: User;
  acceptedDate: Date | null;
  rejected: boolean;
  startingDate: Date;
  dueDate: Date;
  endDate: Date;
}
