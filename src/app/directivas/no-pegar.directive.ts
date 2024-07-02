import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoPegar]',
  standalone: true
})
export class NoPegarDirective {

  constructor() { }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

}
