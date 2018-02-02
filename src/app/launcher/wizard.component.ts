import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import { Selection } from './model/selection.model';
import { Summary } from './model/summary.model';
import { Step } from './step-indicator/step';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.less']
})
export class WizardComponent implements OnInit {
  @ViewChild('stepIndicator') stepIndicator: StepIndicatorComponent;

  selectedSection: string;
  steps: Step[];

  private showAfterCompleted: string[];
  private _summary: Summary;
  private summaryCompleted: boolean = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this._summary = {} as Summary;
    this.showAfterCompleted = [
      'MissionRuntime',
      'TargetEnvironment'
    ];
    this.steps = [{
      id: 'MissionRuntime',
      completed: false,
      hidden: false,
      stleClass: 'mission-runtime',
      title: 'Select Mission & Runtime'
    }, {
      id: 'DependencyChecker',
      completed: false,
      hidden: true,
      stleClass: 'dependency-checker',
      title: 'Dependency Checker'
    }, {
      id: 'TargetEnvironment',
      completed: false,
      hidden: false,
      stleClass: 'target-environment',
      title: 'Select Target Environment'
    }, {
      id: 'ReleaseStrategy',
      completed: false,
      hidden: true,
      showAfterCompleted: this.showAfterCompleted,
      stleClass: 'release-strategy',
      title: 'Select Release Strategy'
    }, {
      id: 'GitProvider',
      completed: false,
      hidden: true,
      showAfterCompleted: this.showAfterCompleted,
      stleClass: 'git-provider',
      title: 'Authorize Git Provider'
    }, {
      id: 'ProjectSummary',
      completed: false,
      hidden: true,
      showAfterCompleted: this.showAfterCompleted,
      stleClass: 'project-summary',
      title: 'Confirm Project Summary'
    }];
  }

  onInViewportChange($event: boolean, id: string) {
    if ($event) {
      this.selectedSection = id;
    }
  }

  // Accessors

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
   * Navigate to next step
   */
  navToNextStep(): void {
    let summaryStep = this.stepIndicator.getStep('ProjectSummary');
    if (summaryStep.completed === true) {
      this.summaryCompleted = true;
      return;
    }

    // Skip pipelines for zip strategy
    let targetEnvStep = this.stepIndicator.getStep('TargetEnvironment');
    let pipelineStep = this.stepIndicator.getStep('ReleaseStrategy');
    if (this.summary.targetEnvironment !== 'zip') {
      pipelineStep.showAfterCompleted = this.showAfterCompleted;
    } else {
      pipelineStep.showAfterCompleted = undefined;
      pipelineStep.hidden = true;
    }

    // Show after steps completed
    this.showStepsAfterCompleted();
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
          let dependency = this.stepIndicator.getStep(step.showAfterCompleted[k]);
          if (dependency.completed !== true) {
            result = true;
          }
        }
        step.hidden = result;
      }
    }
  }
}
