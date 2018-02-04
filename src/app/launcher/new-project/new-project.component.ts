import { Component, Host, Input, ViewEncapsulation } from '@angular/core';
import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-newproject',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.less']
})
export class NewProjectComponent {

  constructor(@Host() public wizardComponent: WizardComponent) {
  }
}
