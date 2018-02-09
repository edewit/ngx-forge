import {
  Component,
  Host,
  Input,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Selection } from '../model/selection.model';
import { TargetEnvironment } from '../model/target-environment.model';
import { TargetEnvironmentService } from '../service/target-environment.service';
import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-step',
  templateUrl: './target-environment-step.component.html',
  styleUrls: ['./target-environment-step.component.less']
})
export class TargetEnvironmentStepComponent extends WizardStep implements OnDestroy {
  @Input() id: string;

  private subscriptions: Subscription[] = [];
  private _targetEnvironments: TargetEnvironment[];

  constructor(@Host() public wizardComponent: WizardComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              public _DomSanitizer: DomSanitizer) {
    super();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
    setTimeout(() => {
      this.restoreSummary();
    }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError

    this.subscriptions.push(this.targetEnvironmentService.getTargetEnvironments().subscribe((val) => {
      if (val !== undefined) {
        this._targetEnvironments = val;
      }
    }));
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
   * Returns target environments to display
   *
   * @returns {TargetEnvironment[]} The target environments to display
   */
  get targetEnvironments(): TargetEnvironment[] {
    return this._targetEnvironments;
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
