import {
  Component,
  Host,
  Input,
  ViewEncapsulation
} from '@angular/core';

import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-step',
  templateUrl: './target-environment-step.component.html',
  styleUrls: ['./target-environment-step.component.less']
})
export class TargetEnvironmentStepComponent extends WizardStep {
  @Input() id: string;

  private _targetEnvironment: string;

  constructor(@Host() public wizardComponent: WizardComponent) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
    this.restoreSummary();
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.wizardComponent.summary.targetEnvironment !== undefined);
  }

  /**
   * Returns target environment
   *
   * @returns {string} The target environment
   */
  get targetEnvironment(): string {
    return this._targetEnvironment;
  }

  /**
   * Set the target environment
   *
   * @param {string} val The target environment
   */
  set targetEnvironment(val: string) {
    this._targetEnvironment = val;
  }

  // Steps

  navToNextStep(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
    this.wizardComponent.navToNextStep();
  }

  updateTargetEnvSelection(): void {
    this.wizardComponent.summary.targetEnvironment = this.targetEnvironment;
  }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.targetEnvironment = selection.targetEnvironment;
  }
}
