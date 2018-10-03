import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { Projectile } from './model/projectile.model';
import { LauncherStep } from './launcher-step';
import { Broadcaster } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.less']
})
export class LauncherComponent implements AfterViewInit {
  /**
   * Flag indicating to show the getting started info after the process is completed.
   *
   * @type {boolean}
   */
  @Input() gettingStartedInfo = false;

  /**
   * The event emitted when an cancel has been selected
   */
  @Output('onCancel') onCancel = new EventEmitter();

  public statusLink: string;
  private _showCancelOverlay = false;
  private _steps: LauncherStep[] = [];
  private summaryCompleted = false;

  constructor(private broadcaster: Broadcaster, public projectile: Projectile<any>) {
  }

  ngAfterViewInit() {
    const id = this.projectile.selectedSection || this.firstNonHiddenStep.id;
    setTimeout(() => {
      this.broadcaster.broadcast('navigate-to', id);
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
  completed(): void {
    this.summaryCompleted = true;
  }

  // Private
  private get firstNonHiddenStep(): LauncherStep {
    return this._steps.find(step => !step.hidden);
  }
}
