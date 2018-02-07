import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ProjectSummaryService } from '../service/project-summary.service';
import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectsummary-step',
  templateUrl: './project-summary-step.component.html',
  styleUrls: ['./project-summary-step.component.less']
})
export class ProjectSummaryStepComponent extends WizardStep implements OnDestroy, OnInit {
  @Input() id: string;

  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private projectSummaryService: ProjectSummaryService) {
    super();
  }

  ngOnInit() {
    this.subscriptions.push(this.projectSummaryService.getMavenArtifact().subscribe((val) => {
      this.wizardComponent.summary.mavenArtifact = val;
    }));
    this.subscriptions.push(this.projectSummaryService.getGroupId().subscribe((val) => {
      this.wizardComponent.summary.groupId = val;
    }));
    this.subscriptions.push(this.projectSummaryService.getProjectName().subscribe((val) => {
      this.wizardComponent.summary.projectName = val;
    }));
    this.subscriptions.push(this.projectSummaryService.getProjectVersion().subscribe((val) => {
      this.wizardComponent.summary.projectVersion = val;
    }));
    this.subscriptions.push(this.projectSummaryService.getSpacePath().subscribe((val) => {
      this.wizardComponent.summary.spacePath = val;
    }));
    this.wizardComponent.addStep(this);
    this.restoreSummary();
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
    for (let i = 0; i < this.wizardComponent.steps.length - 1; i++) {
      let step = this.wizardComponent.steps[i];
      if (step.completed !== true && step.hidden !== true) {
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
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
    this.wizardComponent.navToNextStep();
  }

  /**
   * Navigate to step
   *
   * @param {string} id The step ID
   */
  navToStep(id: string) {
    this.wizardComponent.stepIndicator.navToStep(id);
  }

  /**
   * Set up this application
   */
  setup(): void {
    this.subscriptions.push(this.projectSummaryService.setup(this.wizardComponent.summary).subscribe((val) => {
      if (val === true) {
        this.navToNextStep();
      }
    }));
  }

  // Todo: When do we verify?

  /**
   * Verify and set up this application
   */
  verify(): void {
    this.subscriptions.push(this.projectSummaryService.verify(this.wizardComponent.summary).subscribe((val) => {
      if (val === true) {
        this.setup();
      }
    }));
  }

  // Private

  private initCompleted(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
  }

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.wizardComponent.summary.groupId = selection.groupId;
    this.wizardComponent.summary.projectName = selection.projectName;
    this.wizardComponent.summary.projectVersion = selection.projectVersion;
    this.wizardComponent.summary.spacePath = selection.spacePath;
    this.initCompleted();
  }
}
