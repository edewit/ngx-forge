import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Selection } from './model/selection.model';
import { Summary } from './model/summary.model';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { LauncherStep } from './launcher-step';
import { ProjectSummaryService } from './service/project-summary.service';
import { DependencyCheckService } from './service/dependency-check.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher',
  templateUrl: './launcher.component.html',
  styleUrls: ['./launcher.component.less']
})
export class LauncherComponent implements AfterViewInit, OnInit {
  /**
   * Flag indicating to show the import application work flow. Defaults to the create new application work flow.
   *
   * @type {boolean}
   */
  @Input() importApp: boolean = false;

  /**
   * Setting the flow to 'launch' will skip the pipeline step and show a cluster dropdown. Defaults to 'osio'.
   */
  @Input() flow: string = 'osio';

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
  public isArtifactIdValid: boolean;
  public isGroupIdValid: boolean;
  public isProjectVersionValid: boolean;
  public applicationNames: string[];
  public isProjectNameAvailable: boolean;
  private _selectedSection: string;
  private _showCancelOverlay: boolean = false;
  private _steps: LauncherStep[] = [];
  private _summary: Summary;
  private summaryCompleted: boolean = false;
  private _isProjectNameValid: boolean;
  private spaceId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dependencyCheckService: DependencyCheckService,
              private projectSummaryService: ProjectSummaryService) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let params = this.selectionParams;
      let id = (this.selectionParams !== undefined) ? 'GitProvider' : this.firstNonHiddenStep.id;
      this.stepIndicator.navToStep(id);
    }, 300);
  }

  ngOnInit() {
    let projectName = this.route.snapshot.params['projectName'];
    this._summary = {
      targetEnvironment: this.flow === 'osio' ? 'os' : undefined,
      dependencyCheck: {
        projectName: (projectName !== undefined && projectName.length > 0) ? projectName : undefined
      },
      gitHubDetails: {}
    } as Summary;
    this.projectSummaryService.getCurrentContext()
      .subscribe((response: any) => {
        if (response && this.summary && this.summary.dependencyCheck) {
          this.spaceId = response.space ? response.space.id : '';
          this.dependencyCheckService.getApplicationsInASpace(this.spaceId)
            .subscribe((applications: any[]) => {
              const apps: string[] = applications.map((app: any) => {
                const appNameInLowerCase = app.attributes.name ? (<string>app.attributes.name).toLowerCase() : '';
                return appNameInLowerCase;
              });
              this.applicationNames = apps;
              console.log('applications in step indicator', this.applicationNames);
            });
        }
      });
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
      spacePath: (this._summary.dependencyCheck !== undefined) ? this._summary.dependencyCheck.spacePath : undefined,
      targetEnvironment: this._summary.targetEnvironment,
      cluster: this._summary.cluster,
      dependencyCheck: this._summary.dependencyCheck
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

  /**
   * Returns summary, including full Mission and Runtime objects
   *
   * @returns {Summary} The current user summary
   */
  get summary(): Summary {
    return this._summary;
  }

  /**
   * Checks if the project name is valid
   *
   * @returns boolean
   */
  get isProjectNameValid(): boolean {
    return this._isProjectNameValid;
  }

  /**
   * Set the boolean value for isProjectNameValid
   *
   * @param  {boolean} isValid
   */
  set isProjectNameValid(isValid: boolean) {
    this._isProjectNameValid = isValid;
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
    if (summaryStep !== undefined && summaryStep.completed === true) {
      this.summaryCompleted = true;
      return;
    }
    setTimeout(() => {
      this.stepIndicator.navToNextStep();
    }, 10);
  }

  /**
   * Validate the project name
   *
   * @returns void
   */
  validateProjectName(): void {
    this.isProjectNameValid =
      this.dependencyCheckService.validateProjectName(this.summary.dependencyCheck.projectName);
  }

  /**
   * Check if the application name is already used
   *
   * @returns void
   */
  checkIfProjectNameAvailable(): void {
    this.isProjectNameAvailable =
      this.applicationNames.indexOf(this.summary.dependencyCheck.projectName) === -1 ? true : false;
  }

  // Private

  private get firstNonHiddenStep(): LauncherStep {
    return this._steps.find(step => !step.hidden);
  }

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let search = (window.location.search !== undefined && window.location.search.length > 0)
      ? window.location.search : window.location.href;
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }
}
