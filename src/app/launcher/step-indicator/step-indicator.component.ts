import {
  Component,
  Host,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Selection } from '../model/selection.model';
import { LauncherComponent } from '../launcher.component';
import { DependencyCheckService } from '../service/dependency-check.service';
import { broadcast } from '../shared/telemetry.decorator';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.less']
})
export class StepIndicatorComponent implements OnInit {
  /**
   * Show appropriate style while steps are in progress of being shown
   *
   * @type {boolean}
   */
  @Input() inProgress: boolean = false;

  constructor(
    @Host() public launcherComponent: LauncherComponent,
    private dependencyCheckService: DependencyCheckService) {
  }

  ngOnInit() {
    this.restoreSummary();
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    for (let i = 0; i < this.launcherComponent.steps.length; i++) {
      let step = this.launcherComponent.steps[i];
      if (step.id === this.launcherComponent.selectedSection) {
        if (i + 1 < this.launcherComponent.steps.length) {
          for (let k = i + 1; k < this.launcherComponent.steps.length; k++) {
            let nextStep = this.launcherComponent.steps[k];
            if (nextStep.hidden === true) {
              continue;
            }
            this.navToStep(nextStep.id);
            break;
          }
        }
        break;
      }
    }
  }

  /**
   * Navigate to step
   *
   * @param {string} id The step ID
   */
  @broadcast('stepIndicatorClicked', {})
  navToStep(id: string) {
    let element = document.getElementById(id);
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      // The onInViewportChange event doesn't always set the ID as expected
      this.launcherComponent.onInViewportChange(true, id);
    }, 10);
  }

  /**
   * Validate the application name
   */
  validateProjectName(): void {
    this.launcherComponent.validateProjectName();
  }

  @broadcast('stepIndicatorProjectInputClicked', {})
  broadcastEvent(): void { }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.launcherComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.launcherComponent.summary.dependencyCheck.projectName = selection.projectName;
  }
}
