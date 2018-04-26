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

  private subscriptions: Subscription[] = [];
  private spaceId: string;
  private spaceName: string;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private projectSummaryService: ProjectSummaryService,
              public _DomSanitizer: DomSanitizer) {
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
      .setup(this.launcherComponent.summary, this.spaceId, this.spaceName, false)
      .subscribe((val: any) => {
        if (val && val['uuid_link']) {
          this.launcherComponent.statusLink = val['uuid_link'];
          this.navToNextStep();
        }
      }, (error) => {
        console.log('error in setup: Create', error);
      })
    );
  }

  /**
   * Validate the project name
   */
  validateProjectName(): void {
    this.launcherComponent.isProjectNameValid =
      this.dependencyCheckService.validateProjectName(this.launcherComponent.summary.dependencyCheck.projectName);
  }

  /**
   * Validate the project version
   */
  validateProjectVersion(): void {
    this.launcherComponent.isProjectVersionValid =
      this.dependencyCheckService.validateProjectVersion(this.launcherComponent.summary.dependencyCheck.projectVersion);
  }

  /**
   * Validate the artifact id
   */
  validateArtifactId(): void {
    this.launcherComponent.isArtifactIdValid =
      this.dependencyCheckService.validateArtifactId(this.launcherComponent.summary.dependencyCheck.mavenArtifact);
  }

  /**
   * Validate the group id
   */
  validateGroupId(): void {
    this.launcherComponent.isGroupIdValid =
      this.dependencyCheckService.validateGroupId(this.launcherComponent.summary.dependencyCheck.groupId);
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
}
