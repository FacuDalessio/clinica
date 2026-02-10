import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickAfuera]',
  standalone: true
})
export class ClickAfueraDirective {

  @Output() appClickAfuera  = new EventEmitter<void>();

  constructor(
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: any) {
    const clickedAdentro = this.elementRef.nativeElement.contains(target);
    if (!clickedAdentro) {
      this.appClickAfuera .emit();
    }
  }

}
