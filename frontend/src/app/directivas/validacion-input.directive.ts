import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appValidacionInput]',
  standalone: true
})
export class ValidacionInputDirective {

  @Input('appValidacionInput') format: 'letras' | 'numeros' = 'letras';

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;

    if (this.format === 'letras') {
      this.el.nativeElement.value = initialValue.replace(/[^a-zA-Z]*/g, '');
    } else if (this.format === 'numeros') {
      this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    }

    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
