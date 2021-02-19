import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export class TaskIdValidationPipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value !== 'string') {
      throw new BadRequestException(`Id have to be a string`);
    }

    if (!this.isIdValid(value)) {
      throw new BadRequestException(`'${value}' is an invalid Id`);
    }

    return value;
  }

  private isIdValid(id: any) {
    return Types.ObjectId.isValid(id);
  }
}
