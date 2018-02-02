import {
  Component,
  Host,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectsummary-step',
  templateUrl: './project-summary-step.component.html',
  styleUrls: ['./project-summary-step.component.less']
})
export class ProjectSummaryStepComponent extends WizardStep implements OnInit {
  @Input() id: string;

  private _summary: any;

  constructor(@Host() public wizardComponent: WizardComponent) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    let completed = true;
    for (let i = 0; i < this.wizardComponent.steps.length - 1; i++) {
      let step = this.wizardComponent.steps[i];
      if (step.completed !== true && step.hidden !== true) {
        completed = false;
      }
    }
    return completed;
  }

  /**
   * Returns summary
   *
   * @returns {string} The summary
   */
  get summary(): string {
    return this._summary;
  }

  /**
   * Set the summary
   *
   * @param {string} val The summary
   */
  set summary(val: string) {
    this._summary = val;
  }

  // Steps

  navToNextStep(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
    this.wizardComponent.navToNextStep();
  }
}
