import { PipeTransform } from '@nestjs/common';
import { TaskStatusValidationPipe } from './task-status-validation.pipe';

export class FilterTaskValidationPipe implements PipeTransform {
  transform(value: unknown) {
    console.log('VALUE: %s', value);

    if (typeof value === 'object' && (value as Record<string, unknown>).status != null) {
      const taskValidationPipe = new TaskStatusValidationPipe();
      (value as Record<string, unknown>).status = taskValidationPipe.transform(
        (value as Record<string, unknown>).status,
      );
    }

    return value;
  }
}
