import { Base } from '@/common/domain/base.domain';
import { Car } from '@/modules/car/domain/car.domain';

import { CarPicture } from './car-picture.enum';

export class Picture extends Base {
  car: Car;
  src: string;
  description: string;
  title: string;
  type: CarPicture;
  date: Date;
}
