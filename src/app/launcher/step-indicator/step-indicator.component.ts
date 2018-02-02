import {
  Component,
  Host,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { cloneDeep } from 'lodash';

import { Step } from './step';
import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.less']
})
export class StepIndicatorComponent implements OnInit {
  /**
   * The steps to display
   */
  @Input() steps: Step[];

  private currentStepId: string;

  constructor(@Host() public wizardComponent: WizardComponent) {
  }

  ngOnInit() {
    this.currentStepId = this.steps[0].id;
  }

  /**
   * Get step for the given ID
   *
   * @param {string} id The step ID
   * @returns {Step} The step for the given ID
   */
  getStep(id: string): Step {
    let result: Step;
    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i];
      if (id === step.id) {
        result = step;
        break;
      }
    }
    return result;
  }

  /**
   * Helper to determine if step should be shown
   *
   * @param {string} id The step ID
   * @returns {boolean} True if step should be shown
   */
  isStepHidden(id: string): boolean {
    let result = false;
    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i];
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
    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i];
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
    this.currentStepId = id;
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
