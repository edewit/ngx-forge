import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[review-host]',
})
export class ReviewDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
