import { Base } from '@/common/domain/base.domain';
import { Car } from '@/modules/car/domain/car.domain';
import { User } from '@/modules/user/domain/user.domain';

export class Rent extends Base {
  car: Car;
  user: User;
  admin: User;
  pricePerDay: number;
  startingDate: Date;
  dueDate: Date;
  endDate: Date;
  rejected: boolean;
  acceptedDate?: Date;
}
