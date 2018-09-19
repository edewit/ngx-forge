import {
  Component,
  Host,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { LauncherComponent } from '../launcher.component';
import { broadcast } from '../shared/telemetry.decorator';
import { Broadcaster } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.less']
})
export class StepIndicatorComponent {
  /**
   * Show appropriate style while steps are in progress of being shown
   *
   * @type {boolean}
   */
  @Input() inProgress = false;

  name: string;

  constructor(
    @Host() public launcherComponent: LauncherComponent,
    private broadcaster: Broadcaster) {
      broadcaster.on<string>('navigation').subscribe(id => this.navToStep(id));
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
  broadcastEvent() {}

  applicationTitleChanged(): void {
    this.broadcaster.broadcast('applicationTitleChanged', this.name);
  }
}
