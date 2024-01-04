import { BadRequestException, NotFoundException } from '@nestjs/common';

export enum UserError {
  NOT_FOUND = 'User not found',
}
