import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild
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
import { broadcast } from '../../shared/telemetry.decorator';
import { NgForm } from '@angular/forms';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectsummary-importapp-step',
  templateUrl: './project-summary-importapp-step.component.html',
  styleUrls: ['./project-summary-importapp-step.component.less']
})
export class ProjectSummaryImportappStepComponent extends LauncherStep implements OnDestroy, OnInit {
  @ViewChild('form') form: NgForm;
  @Input() id: string;

  public setUpErrResponse: Array<any> = [];
  public setupInProgress: boolean = false;
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
  get completed(): boolean {
    if (this.launcherComponent.selectedSection !== 'ProjectSummary' || this.form.invalid) {
      return false;
    }
    for (let i = 0; i < this.launcherComponent.steps.length - 1; i++) {
      let step = this.launcherComponent.steps[i];
      if (!(step.optional === true || step.completed === true) && step.hidden !== true) {
        return false;
      }
    }
    return true;
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.launcherComponent.navToNextStep('ProjectSummary');
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
  @broadcast('completeSummaryStep_Import', {
    'launcherComponent.summary': {
      location: 'gitHubDetails.organization',
      pipeline: 'pipeline.name',
      projectName: 'dependencyCheck.projectName',
      repository: 'gitHubDetails.repository',
      spacePath: 'dependencyCheck.spacePath',
      username: 'gitHubDetails.login'
    }
  })
  setup(): void {
    this.setupInProgress = true;
    this.subscriptions.push(
      this.projectSummaryService
        .setup(this.launcherComponent.summary)
        .subscribe((val: any) => {
          if (val && val['uuid_link']) {
            this.launcherComponent.statusLink = val['uuid_link'];
            this.navToNextStep();
          }
        }, (error) => {
          this.setupInProgress = false;
          if (error) {
            this.displaySetUpErrorResponse(error);
          }
          console.log('error in setup: Import', error);
        })
    );
  }

  get dependencyCheck(): DependencyCheck {
    return this.launcherComponent.summary.dependencyCheck;
  }

  get summary(): Summary {
    return this.launcherComponent.summary;
  }

  // Private

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
