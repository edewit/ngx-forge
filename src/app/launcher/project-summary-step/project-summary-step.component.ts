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
  selector: 'f8launcher-projectsummary-step',
  templateUrl: './project-summary-step.component.html',
  styleUrls: ['./project-summary-step.component.less']
})
export class ProjectSummaryStepComponent implements OnInit {
  @Input() id: string;

  private _summary: any;

  constructor(@Host() public wizardComponent: WizardComponent) {
  }

  ngOnInit() {
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    let completed = true;
    let steps = this.wizardComponent.stepIndicator.steps;

    for (let i = 0; i < steps.length - 1; i++) {
      let step = steps[i];
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
    this.wizardComponent.stepIndicator.getStep(this.id).completed = this.stepCompleted;
    this.wizardComponent.navToNextStep();
  }
}
