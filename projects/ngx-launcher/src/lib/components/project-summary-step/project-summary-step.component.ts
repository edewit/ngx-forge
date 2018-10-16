import { Component, Host, Input, OnDestroy, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { Subscription } from 'rxjs';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Projectile } from '../../model/projectile.model';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { broadcast } from '../../shared/telemetry.decorator';

import * as _ from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectsummary-step',
  templateUrl: './project-summary-step.component.html',
  styleUrls: ['./project-summary-step.component.less']
})
export class ProjectSummaryStepComponent extends LauncherStep implements OnDestroy, OnInit {
  @Input() submitButtonText = 'Set Up Application';
  @ViewChild('form') form: NgForm;

  public setUpErrResponse: Array<any> = [];
  public setupInProgress = false;
  private subscriptions: Subscription[] = [];

  constructor(@Host() @Optional() private launcherComponent: LauncherComponent,
              private projectSummaryService: ProjectSummaryService,
              private dependencyCheckService: DependencyCheckService,
              private broadcaster: Broadcaster,
              public _DomSanitizer: DomSanitizer,
              private projectile: Projectile<any>) {
    super(projectile);
  }

  ngOnInit() {
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    this.subscriptions.push(
      this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
          _.defaults(this.projectile.sharedState.state, val);
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
    if (this.form.invalid) {
      return false;
    }
    if (this.launcherComponent) {
      for (let i = 0; i < this.launcherComponent.steps.length - 1; i++) {
        const step = this.launcherComponent.steps[i];
        if (!step.hidden && !(step.optional || step.completed)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Set up this application
   */
  @broadcast('completeSummaryStep_Create', {
    'launcherComponent.summary': {
      location: 'gitHubDetails.organization',
      mission: 'mission.name',
      pipeline: 'pipeline.name',
      projectName: 'dependencyCheck.projectName',
      repository: 'gitHubDetails.repository',
      runtime: 'runtime.name',
      spacePath: 'dependencyCheck.spacePath',
      username: 'gitHubDetails.login'
    }
  })
  setup(): void {
    this.setupInProgress = true;
    this.subscriptions.push(
      this.projectSummaryService
      .setup(this.projectile)
      .subscribe((val: any) => {
        if (!val || !val['uuid_link']) {
          this.displaySetUpErrorResponse('Invalid response from server!');
        }

        this.launcherComponent.statusLink = val['uuid_link'];
        this.broadcaster.broadcast('progressEvents', val.events);
        this.launcherComponent.completed();
      }, (error) => {
        this.setupInProgress = false;
        if (error) {
          this.displaySetUpErrorResponse(error);
        }
        console.log('error in setup: Create', error);
      })
    );
  }

  /**
   * displaySetUpErrorResponse - takes a message string and returns nothing
   * Displays the response received from the setup in case of error
   */
  displaySetUpErrorResponse(err: any): void {
    const notification = {
        iconClass: 'pficon-error-circle-o',
        alertClass: 'alert-danger',
        text: err
    };
    this.setUpErrResponse.push(notification);
  }
}
