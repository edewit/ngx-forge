import { Component, Host, Input, ViewEncapsulation } from '@angular/core';
import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-activatebooster',
  templateUrl: './activate-booster.component.html',
  styleUrls: ['./activate-booster.component.less']
})
export class ActivateBoosterComponent {

  constructor(@Host() public wizardComponent: WizardComponent) {
  }
}
