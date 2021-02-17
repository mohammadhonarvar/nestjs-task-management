import { BadRequestException, PipeTransform } from '@nestjs/common';
import { allowedTaskStatusList } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatusList = allowedTaskStatusList;

  transform(value: unknown) {
    console.log('VALUE in TaskStatusValidationPipe: %o', value);

    if (typeof value !== 'string') {
      throw new BadRequestException(`Status have to be a string`);
    }

    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`'${value}' is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    return this.allowedStatusList.indexOf(status) !== -1;
  }
}
