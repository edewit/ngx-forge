import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import * as _ from 'lodash';

import { Pipeline } from '../../model/pipeline.model';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyCheck } from '../../model/dependency-check.model';
import { Projectile } from '../../model/summary.model';
import { broadcast } from '../../shared/telemetry.decorator';
import { Broadcaster } from 'ngx-base';
import { NgForm } from '@angular/forms';
import { ReviewDirective } from './review.directive';
import { ReviewComponent } from '../../review.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectsummary-createapp-step',
  templateUrl: './project-summary-createapp-step.component.html',
  styleUrls: ['./project-summary-createapp-step.component.less']
})
export class ProjectSummaryCreateappStepComponent extends LauncherStep implements OnDestroy, OnInit {
  @ViewChild('form') form: NgForm;
  @Input() id: string;
  @Input() depEditorFlag: boolean;

  @ViewChild(ReviewDirective) reviewHost: ReviewDirective;

  public setUpErrResponse: Array<any> = [];
  public setupInProgress = false;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private projectSummaryService: ProjectSummaryService,
              private broadcaster: Broadcaster,
              public _DomSanitizer: DomSanitizer,
              private projectile: Projectile,
              private componentFactoryResolver: ComponentFactoryResolver) {
    super(null, projectile);
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    this.restoreSummary();

    this.subscriptions.push(
      this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
          // Don't override user's application name
          // _.defaults(this.launcherComponent.summary.dependencyCheck, val);
        }));

    this.loadComponents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private loadComponents() {
    const viewContainerRef = this.reviewHost.viewContainerRef;
    viewContainerRef.clear();

    this.launcherComponent.steps.forEach(step => {
      if (step.reviewComponentType) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(step.reviewComponentType);

        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<ReviewComponent>componentRef.instance).data = this._projectile.getDetails(step.id);
      }
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
    for (let i = 0; i < this.launcherComponent.steps.length - 1; i++) {
      const step = this.launcherComponent.steps[i];
      if (!step.hidden && !(step.optional || step.completed)) {
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
      .setup(this._projectile)
      .subscribe((val: any) => {
        if (!val || !val['uuid_link']) {
          this.displaySetUpErrorResponse('Invalid response from server!');
        }

        this.launcherComponent.statusLink = val['uuid_link'];
        this.broadcaster.broadcast('progressEvents', val.events);
        this.navToNextStep();
      }, (error) => {
        this.setupInProgress = false;
        if (error) {
          this.displaySetUpErrorResponse(error);
        }
        console.log('error in setup: Create', error);
      })
    );
  }

  get dependencyCheck(): DependencyCheck {
    return this._projectile.dependencyCheck;
  }

  get summary(): Projectile {
    return this._projectile;
  }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    // const selection: Selection = this.launcherComponent.selectionParams;
    // if (selection === undefined) {
    //   return;
    // }
    // this.launcherComponent.summary.dependencyCheck.groupId = selection.groupId;
    // this.launcherComponent.summary.dependencyCheck.projectName = selection.projectName;
    // this.launcherComponent.summary.dependencyCheck.projectVersion = selection.projectVersion;
    // this.launcherComponent.summary.dependencyCheck.spacePath = selection.spacePath;
  }

  restoreModel(): void {
  }

  saveModel(): any {
  }


  toggleExpanded(pipeline: Pipeline) {
    pipeline.expanded = (pipeline.expanded !== undefined) ? !pipeline.expanded : true;
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
