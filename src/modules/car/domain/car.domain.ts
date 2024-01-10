import { Base } from '@/common/domain/base.domain';
import { Picture } from '@/modules/picture/domain/picture.domain';

export class Car extends Base {
  brand: string;
  model: string;
  color: string;
  passengers: number;
  ac: boolean;
  pricePerDay: number;
  images?: Picture[];
}
