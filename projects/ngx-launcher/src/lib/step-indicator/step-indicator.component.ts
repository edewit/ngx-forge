import {
  Component,
  Host,
  Input,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LauncherComponent } from '../launcher.component';
import { broadcast } from '../shared/telemetry.decorator';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../model/summary.model';
import { DependencyCheck } from '../model/dependency-check.model';

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
  dependencyCheck: DependencyCheck = new DependencyCheck();

  constructor(public launcherComponent: LauncherComponent,
    public projectile: Projectile<any>,
    private route: ActivatedRoute,
    broadcaster: Broadcaster) {
      broadcaster.on<string>('navigation').subscribe(id => this.navToStep(id));
  }

  ngOnInit(): void {
    this.dependencyCheck = this.projectile.sharedState.state;
    this.dependencyCheck.projectName = this.dependencyCheck.projectName
      || this.route.snapshot.params['projectName'];
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(fromStepId?: string): void {
    this.projectile.selectedSection = fromStepId;
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
}
