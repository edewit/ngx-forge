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
import { ProjectSummaryService } from '../../service/project-summary.service';
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
              private projectSummaryService: ProjectSummaryService,
              private broadcaster: Broadcaster,
              public _DomSanitizer: DomSanitizer,
              private projectile: Projectile<any>,
              private componentFactoryResolver: ComponentFactoryResolver) {
    super(null, projectile);
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
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

    const steps = this.launcherComponent.steps.slice(0);
    // TODO this sort makes mission runtime to be the first in order to have the right style
    steps.sort((x, y) => x.id === 'MissionRuntime' ? -1 : (y.id === 'MissionRuntime' ? 1 : 0)).forEach(step => {
      if (step.reviewComponentType && !step.hidden) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(step.reviewComponentType);

        const componentRef = viewContainerRef.createComponent(componentFactory);
        const stepState = this.projectile.getState(step.id);
        if (stepState) {
          (<ReviewComponent>componentRef.instance).data = stepState.state;
        }
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
      .setup(this.projectile)
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
    return this.projectile.dependencyCheck;
  }

  get summary(): Projectile<any> {
    return this.projectile;
  }

  restoreModel(): void {
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
