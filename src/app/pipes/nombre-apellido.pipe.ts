import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombreApellido',
  standalone: true
})
export class NombreApellidoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    return value.apellido + ', ' + value.nombre;
  }

}
