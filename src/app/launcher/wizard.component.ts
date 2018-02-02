import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Selection } from './model/selection.model';
import { Summary } from './model/summary.model';
import { Step } from './step-indicator/step';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { WizardStep } from './wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.less']
})
export class WizardComponent implements OnInit {
  @ViewChild('stepIndicator') stepIndicator: StepIndicatorComponent;

  private _selectedSection: string;
  private _steps: WizardStep[] = [];
  private _summary: Summary;
  private summaryCompleted: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this._summary = {} as Summary;
  }

  onInViewportChange($event: boolean, id: string) {
    if ($event) {
      this._selectedSection = id;
    }
  }

  // Accessors

  get selectedSection(): string {
    return this._selectedSection;
  }

  /**
   * Returns current selection values needed to restore upon a redirect
   *
   * @returns {Selection} The current selection
   */
  get selection(): Selection {
    let selection = {
      missionId: this._summary.mission.missionId,
      runtimeId: this._summary.runtime.runtimeId,
      runtimeVersion: this._summary.runtime.version
    } as Selection;
    return selection;
  }

  /**
   * Returns current selection parameters, if any
   *
   * @returns {Selection} Current selection parameters or undefined
   */
  get selectionParams(): Selection {
    let userSelection: Selection;
    let selection = this.getRequestParam('selection');
    if (selection !== null) {
      userSelection = JSON.parse(selection);
    }
    return userSelection;
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
   * @returns {WizardStep[]} Steps for this component
   */
  get steps(): WizardStep[] {
    return this._steps;
  }

  /**
   * Returns summary, including full Mission and Runtime objects
   *
   * @returns {Summary} The current user summary
   */
  get summary(): Summary {
    return this._summary;
  }

  /**
   * Set user summary
   *
   * @param {Summary} val The current user summary
   */
  set summary(summary: Summary) {
    this._summary = summary;
  }

  // Steps

  /**
   * Add step
   *
   * @param {WizardStepComponent} step
   */
  addStep(step: WizardStep) {
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
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
   * Navigate to next step
   */
  navToNextStep(): void {
    let summaryStep = this.getStep('ProjectSummary');
    if (summaryStep.completed === true) {
      this.summaryCompleted = true;
      return;
    }

    // Show after steps completed
    this.showStepsAfterCompleted();

    // Skip pipelines for zip strategy
    if (this.summary.targetEnvironment === 'zip') {
      this.getStep('ReleaseStrategy').hidden = true;
    }
    setTimeout(() => {
      this.stepIndicator.navToNextStep();
    }, 10);
  }

  // Private

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  // Show hidden steps after previous steps have been completed
  private showStepsAfterCompleted(): void {
    for (let i = 0; i < this.steps.length; i++) {
      let step = this.steps[i];
      if (step.showAfterCompleted !== undefined) {
        let result = false;
        // Iterate over potentally completed steps
        for (let k = 0; k < step.showAfterCompleted.length; k++) {
          let dependency = this.getStep(step.showAfterCompleted[k]);
          if (dependency.completed !== true) {
            result = true;
          }
        }
        step.hidden = result;
      }
    }
  }
}
