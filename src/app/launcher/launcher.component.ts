import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Selection } from './model/selection.model';
import { Summary } from './model/summary.model';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { LauncherStep } from './launcher-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.less']
})
export class LauncherComponent implements AfterViewInit, OnInit {
  @Input() importApp: boolean = false;

  @ViewChild('stepIndicator') stepIndicator: StepIndicatorComponent;

  private _selectedSection: string;
  private _steps: LauncherStep[] = [];
  private _summary: Summary;
  private summaryCompleted: boolean = false;

  constructor(private router: Router) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.stepIndicator.navToNextStep();
    }, 200);
  }

  ngOnInit() {
    this._summary = {
      dependencyCheck: {},
      gitHubDetails: {}
    } as Summary;
  }

  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this._selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }

  // Accessors

  /**
   * Returns the current step ID
   *
   * @returns {string} The current step ID
   */
  get selectedSection(): string {
    return this._selectedSection;
  }

  /**
   * Returns current selection needed to restore upon a redirect
   *
   * @returns {Selection} The current selection
   */
  get currentSelection(): Selection {
    let selection = {
      groupId: (this._summary.dependencyCheck !== undefined) ? this._summary.dependencyCheck.groupId : undefined,
      missionId: (this._summary.mission !== undefined) ? this._summary.mission.id : undefined,
      pipelineId: (this._summary.pipeline !== undefined) ? this._summary.pipeline.id : undefined,
      projectName: (this._summary.dependencyCheck !== undefined)
        ? this._summary.dependencyCheck.projectName : undefined,
      projectVersion: (this._summary.dependencyCheck !== undefined)
        ? this._summary.dependencyCheck.projectVersion : undefined,
      runtimeId: (this._summary.runtime !== undefined) ? this._summary.runtime.id : undefined,
      runtimeVersion: (this._summary.runtime !== undefined) ? this._summary.runtime.version : undefined,
      platform: (this._summary.runtime !== undefined) ? this._summary.runtime.platform : 'maven',
      spacePath: (this._summary.dependencyCheck !== undefined) ? this._summary.dependencyCheck.spacePath : undefined,
      targetEnvironment: this._summary.targetEnvironment
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
   * @returns {LauncherStep[]} Steps for this component
   */
  get steps(): LauncherStep[] {
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
   * Get step for the given ID
   *
   * @param {string} id The step ID
   * @returns {Step} The step for the given ID
   */
  getStep(id: string): LauncherStep {
    let result: LauncherStep;
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
}
