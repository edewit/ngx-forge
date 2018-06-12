import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

import { defaults, get } from 'lodash';
import { Broadcaster } from 'ngx-base';

import { Pipeline } from '../../model/pipeline.model';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyCheck } from '../../model/dependency-check.model';
import { Summary } from '../../model/summary.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectsummary-createapp-step',
  templateUrl: './project-summary-createapp-step.component.html',
  styleUrls: ['./project-summary-createapp-step.component.less']
})
export class ProjectSummaryCreateappStepComponent extends LauncherStep implements OnDestroy, OnInit {
  @Input() id: string;
  @Input() depEditorFlag: boolean;

  public setUpErrResponse: Array<any> = [];
  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private projectSummaryService: ProjectSummaryService,
              public _DomSanitizer: DomSanitizer,
              private broadcaster: Broadcaster) {
    super();
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    this.restoreSummary();

    this.subscriptions.push(
      this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
          // Don't override user's application name
          defaults(this.launcherComponent.summary.dependencyCheck, val);
        }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    let completed = true;
    if ((this.launcherComponent.isProjectNameValid !== undefined && this.launcherComponent.isProjectNameValid === false)
      || (this.launcherComponent.isGroupIdValid !== undefined && this.launcherComponent.isGroupIdValid === false)
      || (this.launcherComponent.isArtifactIdValid !== undefined && this.launcherComponent.isArtifactIdValid === false)
      || (this.launcherComponent.isProjectVersionValid !== undefined &&
          this.launcherComponent.isProjectVersionValid === false)
      || (this.launcherComponent.isProjectNameAvailable !== undefined &&
          this.launcherComponent.isProjectNameAvailable === false )) {
      return false;
    }
    for (let i = 0; i < this.launcherComponent.steps.length - 1; i++) {
      let step = this.launcherComponent.steps[i];
      if (!(step.optional === true || step.completed === true) && step.hidden !== true) {
        completed = false;
      }
    }
    return completed;
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.completed = this.stepCompleted;
    this.launcherComponent.navToNextStep();
  }

  /**
   * Navigate to step
   *
   * @param {string} id The step ID
   */
  navToStep(id: string) {
    this.launcherComponent.stepIndicator.navToStep(id);
  }

  /**
   * Set up this application
   */
  setup(): void {
    this.subscriptions.push(
      this.projectSummaryService
      .setup(this.launcherComponent.summary)
      .subscribe((val: any) => {
        if (val && val['uuid_link']) {
          this.launcherComponent.statusLink = val['uuid_link'];
          this.navToNextStep();
        }
      }, (error) => {
        if (error) {
          this.displaySetUpErrorResponse(error);
        }
        console.log('error in setup: Create', error);
      })
    );
    const summary = this.launcherComponent.summary;
    this.broadcaster.broadcast('completeSummaryStep_Create', {
      mission: get(summary, 'mission.name', null),
      runtime: get(summary, 'runtime.name', null),
      dependencySnapshot: get(summary, 'dependencyEditor.dependencySnapshot', null),
      pipeline: get(summary, 'pipeline.name', null),
      application: get(summary, 'dependencyCheck', null),
      gitHubDetails: {
        location: get(summary, 'gitHubDetails.organization', null),
        username: get(summary, 'gitHubDetails.login', null),
        repository: get(summary, 'gitHubDetails.repository', null)
      }
    });
  }

  /**
   * Validate the project name
   */
  validateProjectName(): void {
    this.launcherComponent.validateProjectName();
  }

  /**
   * Validate the project version
   */
  validateProjectVersion(): void {
    this.launcherComponent.validateProjectVersion();
  }

  /**
   * Validate the artifact id
   */
  validateArtifactId(): void {
    this.launcherComponent.validateArtifactId();
  }

  /**
   * Validate the group id
   */
  validateGroupId(): void {
    this.launcherComponent.validateGroupId();
  }

  get dependencyCheck(): DependencyCheck {
    return this.launcherComponent.summary.dependencyCheck;
  }

  get summary(): Summary {
    return this.launcherComponent.summary;
  }

  // Private

  private initCompleted(): void {
    this.completed = this.stepCompleted;
  }

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.launcherComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.launcherComponent.summary.dependencyCheck.groupId = selection.groupId;
    this.launcherComponent.summary.dependencyCheck.projectName = selection.projectName;
    this.launcherComponent.summary.dependencyCheck.projectVersion = selection.projectVersion;
    this.launcherComponent.summary.dependencyCheck.spacePath = selection.spacePath;
    this.initCompleted();
  }

  private toggleExpanded(pipeline: Pipeline) {
    pipeline.expanded = (pipeline.expanded !== undefined) ? !pipeline.expanded : true;
  }

    /**
     * displaySetUpErrorResponse - takes a message string and returns nothing
     * Displays the response received from the setup in case of error
     */
    private displaySetUpErrorResponse(err: any): void {
      let notification = {
          iconClass: 'pficon-error-circle-o',
          alertClass: 'alert-danger',
          text: err
      };
      this.setUpErrResponse.push(notification);
  }
}
