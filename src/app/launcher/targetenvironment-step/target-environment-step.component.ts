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

  // Steps

  navToNextStep(): void {
    this.wizardComponent.navToNextStep();
  }

  updateTargetEnvSelection(): void {
    this.initCompleted();
  }

  // Private

  private initCompleted(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
  }

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.wizardComponent.summary.targetEnvironment = selection.targetEnvironment;
    this.initCompleted();
  }
}
