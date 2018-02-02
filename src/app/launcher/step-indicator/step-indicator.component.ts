import {
  Component,
  Host,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.less']
})
export class StepIndicatorComponent implements OnInit {
  constructor(@Host() public wizardComponent: WizardComponent) {
  }

  ngOnInit() {
  }

  /**
   * Helper to determine if step should be shown
   *
   * @param {string} id The step ID
   * @returns {boolean} True if step should be shown
   */
  isStepHidden(id: string): boolean {
    let result = false;
    for (let i = 0; i < this.wizardComponent.steps.length; i++) {
      let step = this.wizardComponent.steps[i];
      if (id === step.id) {
        result = (step.hidden === true);
        break;
      }
    }
    return result;
  }

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    for (let i = 0; i < this.wizardComponent.steps.length; i++) {
      let step = this.wizardComponent.steps[i];
      if (step.completed !== true && step.hidden !== true) {
        this.navToStep(step.id);
        break;
      }
    }
  }

  /**
   * Navigate to step
   *
   * @param {string} id The step ID
   */
  navToStep(id: string) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
