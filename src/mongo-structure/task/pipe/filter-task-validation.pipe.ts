import { PipeTransform } from '@nestjs/common';
import { TaskStatusValidationPipe } from './task-status-validation.pipe';

const taskValidationPipe = new TaskStatusValidationPipe();
export class FilterTaskValidationPipe implements PipeTransform {
  transform(value: unknown) {
    console.log('VALUE: %s', value);

    if (typeof value === 'object' && (value as Record<string, unknown>).status != null) {
      const _value = value as Record<string, unknown>;
      _value.status = taskValidationPipe.transform(_value.status);
      value = _value;
    }

    return value;
  }
}
