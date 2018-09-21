import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { Projectile } from './model/summary.model';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { LauncherStep } from './launcher-step';
import { broadcast } from './shared/telemetry.decorator';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.less']
})
export class LauncherComponent implements AfterViewInit {
  /**
   * Flag indicating to show the import application work flow. Defaults to the create new application work flow.
   *
   * @type {boolean}
   */
  @Input() importApp = false;

  /**
   * Setting the flow to 'launch' will skip the pipeline step and show a cluster dropdown. Defaults to 'osio'.
   */
  @Input() flow = 'osio';

  /**
   * Setting the flag to show dependency editor as internal feature
   */
  @Input() depEditorFlag = false;
  /**
   * The event emitted when an cancel has been selected
   */
  @Output('onCancel') onCancel = new EventEmitter();

  /**
   * The event emitted after setup has completed
   */
  @Output('onComplete') onComplete = new EventEmitter();

  @ViewChild('stepIndicator') stepIndicator: StepIndicatorComponent;

  public statusLink: string;
  private _showCancelOverlay = false;
  private _steps: LauncherStep[] = [];
  private summaryCompleted = false;

  constructor(private _projectile: Projectile<any>) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const id = this._projectile.selectedSection || this.firstNonHiddenStep.id;
      this.stepIndicator.navToStep(id);
    }, 2000);
  }

  /**
   * Returns flag indicating cancel overlay should be shown
   *
   * @returns {boolean} True if cancel overlay should be shown
   */
  get showCancelOverlay(): boolean {
    return this._showCancelOverlay;
  }

  /**
   * Returns flag indicating next steps should be shown
   *
   * @returns {boolean} True if the next steps should be shown
   */
  get showNextSteps(): boolean {
    return this.summaryCompleted;
  }

  /**
   * Returns steps for this component
   *
   * @returns {LauncherStep[]} Steps for this component
   */
  get steps(): LauncherStep[] {
    return this._steps;
  }

  // Steps
  /**
   * Add step
   *
   * @param {LauncherStepComponent} step
   */
  addStep(step: LauncherStep) {
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
  }

  /**
   * Cancel has been selected
   */
  cancel() {
    this._showCancelOverlay = true;
  }

  /**
   * Cancel has been aborted
   */
  cancelAborted() {
    this._showCancelOverlay = false;
  }

  /**
   * Cancel has been confirmed
   */
  cancelConfirmed() {
    this._showCancelOverlay = false;
    this.onCancel.emit();
  }

  /**
   * Setup has completed
   */
  @broadcast('viewApplicationButtonClicked', {})
  completed() {
    this.onComplete.emit();
  }

  /**
   * Get step for the given ID
   *
   * @param {string} id The step ID
   * @returns {Step} The step for the given ID
   */
  getStep(id: string): LauncherStep {
    let result: LauncherStep;
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      if (id === step.id) {
        result = step;
        break;
      }
    }
    return result;
  }

  /**
   * Navigate to next step
   */
  navToNextStep(fromStepId: string): void {
    if (fromStepId === 'ProjectSummary') {
      this.summaryCompleted = true;
      return;
    }
    setTimeout(() => {
      this.stepIndicator.navToNextStep(fromStepId);
    }, 10);
  }

  // Private
  private get firstNonHiddenStep(): LauncherStep {
    return this._steps.find(step => !step.hidden);
  }
}
