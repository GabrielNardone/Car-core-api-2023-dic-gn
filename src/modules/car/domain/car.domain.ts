import { Base } from '@/common/domain/base.domain';

export class Car extends Base {
  brand: string;
  model: string;
  color: string;
  passengers: number;
  ac: boolean;
  pricePerDay: number;
}
