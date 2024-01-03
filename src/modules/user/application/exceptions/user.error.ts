import { BadRequestException, NotFoundException } from '@nestjs/common';

export enum UserError {
  NOT_FOUND = 'User not found',
}

export const notFoundError = (id: number) => {
  throw new NotFoundException(`User with id ${id} not found`);
};

export const badRequestError = (message: string) => {
  throw new BadRequestException(message);
};
