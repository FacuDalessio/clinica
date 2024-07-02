import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hora',
  standalone: true
})
export class HoraPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    if (typeof value == 'string') {
      const minutos = value.split(":")[1];
      let hora = parseInt(value.split(":")[0]);

      if (hora <= 11) {
        value = `${value} AM`;
      }else{
        if(hora == 12){
          value = `${value} PM`;
        }else{
          hora = hora - 12;
          value = `${hora}:${minutos} PM`; 
        }
      }
    }else{
      value = `${value.getHours()}:${value.getMinutes()} Hs`;
    }

    return value;
  }

}
