import { Picture } from '../../domain/picture.domain';

export const PICTURE_REPOSITORY = 'PICTURE_REPOSITORY';

export interface IPictureRepository {
  create(picture: Picture): Promise<Picture>;
  delete(id: number): Promise<boolean>;
}
