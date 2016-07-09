import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'replaceLine' })
export class ReplaceLinePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
}