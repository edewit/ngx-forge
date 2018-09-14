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
  @Input() inProgress = false;

  name: string;

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
  navToNextStep(fromStepId?: string): void {
    const steps = this.launcherComponent.steps.filter(step => !step.hidden);
    const index = steps.findIndex(step => step.id === fromStepId);
    this.navToStep(steps[index + 1].id);
  }

  /**
   * Navigate to step
   *
   * @param {string} id The step ID
   */
  @broadcast('stepIndicatorClicked', {step: '[0]'})
  navToStep(id: string) {
    const element = document.getElementById(id);
    if (element !== null) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  @broadcast('stepIndicatorProjectInputClicked', {})
  broadcastEvent(): void { }
  // Restore mission & runtime summary
  private restoreSummary(): void {
    // TODO what is this needed here as well
    // const selection: Selection = this.launcherComponent.selectionParams;
    // if (selection === undefined) {
    //   return;
    // }
    // this.launcherComponent.summary.dependencyCheck.projectName = selection.projectName;
  }
}
