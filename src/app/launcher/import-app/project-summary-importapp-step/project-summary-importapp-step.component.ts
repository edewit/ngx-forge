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

import { defaults } from 'lodash';
import { BroadcastService } from '../../service/broadcast.service';

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
  selector: 'f8launcher-projectsummary-importapp-step',
  templateUrl: './project-summary-importapp-step.component.html',
  styleUrls: ['./project-summary-importapp-step.component.less']
})
export class ProjectSummaryImportappStepComponent extends LauncherStep implements OnDestroy, OnInit {
  @Input() id: string;

  public setUpErrResponse: Array<any> = [];
  private subscriptions: Subscription[] = [];
  private spaceId: string;
  private spaceName: string;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private projectSummaryService: ProjectSummaryService,
              public _DomSanitizer: DomSanitizer,
              private broadcaster: BroadcastService) {
    super();
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    this.restoreSummary();

    this.subscriptions.push(
      this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
          let artifactTS: Date = new Date();
          if (val.mavenArtifact) {
            val.mavenArtifact += '-' + artifactTS.getTime();
          }
          // Don't override user's application name
          defaults(this.launcherComponent.summary.dependencyCheck, val);
        })
    );
    this.subscriptions.push(
      this.projectSummaryService.getCurrentContext()
        .subscribe((response: any) => {
          if (response && this.launcherComponent && this.launcherComponent.summary &&
            this.launcherComponent.summary.dependencyCheck) {
            this.launcherComponent.summary.dependencyCheck.spacePath = response.path;
            this.spaceName = '/' + response.name;
            this.spaceId = response.space ? response.space.id : '';
          }
        })
    );
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
        this.launcherComponent.isProjectNameAvailable === false)) {
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
    this.broadcaster.broadcast('completeSummaryStep_Import', {
      pipeline: this.launcherComponent.summary.pipeline.name,
      application: this.launcherComponent.summary.dependencyCheck,
      gitHubDetails: {
        location: this.launcherComponent.summary.gitHubDetails.organization,
        username: this.launcherComponent.summary.gitHubDetails.login,
        repository: this.launcherComponent.summary.gitHubDetails.repository
      }
    });
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
        .setup(this.launcherComponent.summary, this.spaceId, this.spaceName, true)
        .subscribe((val: any) => {
          if (val && val['uuid_link']) {
            this.launcherComponent.statusLink = val['uuid_link'];
            this.navToNextStep();
          }
        }, (error) => {
          if (error) {
            this.displaySetUpErrorResponse(error);
          }
          console.log('error in setup: Import', error);
        })
    );
    this.broadcaster.broadcast('completeSummaryStep_Create', {
      pipeline: this.launcherComponent.summary.pipeline.name,
      application: this.launcherComponent.summary.dependencyCheck,
      gitHubDetails: {
        location: this.launcherComponent.summary.gitHubDetails.organization,
        username: this.launcherComponent.summary.gitHubDetails.login,
        repository: this.launcherComponent.summary.gitHubDetails.repository
      }
    });
  }

  /**
   * Validate the application name
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
