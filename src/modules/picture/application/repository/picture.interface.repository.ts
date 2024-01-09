import { Picture } from '../../domain/picture.domain';

export const PICTURE_REPOSITORY = 'PICTURE_REPOSITORY';

export interface IPictureRepository {
  create(picture: Picture): Promise<Picture>;
  findAll(): Promise<Picture[]>;
  findById(id: number): Promise<Picture>;
  update(id: number, picture: Picture): Promise<Picture>;
  delete(id: number): Promise<boolean>;
}
