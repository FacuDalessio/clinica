import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCase',
  standalone: true
})
export class CamelCasePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\b\w/g, first => first.toUpperCase());
  }
}
