import { Component, Input } from '@angular/core';
import { Broadcaster } from 'ngx-base';

@Component({
  selector: 'f8launcher-button-next-step',
  template: `
    <div class="container-fluid">
      <div class="f8launcher-continue">
        <button class="btn btn-link" [class.animate-continue]="!disabled" [disabled]="disabled"
          (click)="navToStep()">
          <span class="fa-stack fa-2x">
            <i class="fa fa-circle fa-stack-2x"></i>
            <i class="fa fa-angle-double-down fa-stack-1x fa-inverse"></i>
          </span>
        </button>
      </div>
    </div>
  `
})
export class ButtonNextStepComponent {
  @Input()
  disabled: boolean;

  @Input()
  navFromId: string;

  constructor(private broadcaster: Broadcaster) {}

  navToStep() {
    this.broadcaster.broadcast('navigate-from', this.navFromId);
  }
}
