import {
  Component,
  Host,
  Input,
  OnDestroy,
  ViewEncapsulation,
  state,
  trigger,
  style,
  animate,
  transition
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Selection } from '../../model/selection.model';
import { TargetEnvironment } from '../../model/target-environment.model';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import {Cluster} from '../../model/cluster.model';
import { Broadcaster } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-createapp-step',
  templateUrl: './target-environment-createapp-step.component.html',
  styleUrls: ['./target-environment-createapp-step.component.less'],
  animations:
  [
    trigger('toggleAnimation', [
      state('active', style({
        display: 'inline',
      })),
      state('inactive', style({
        opacity: '0',
        display: 'none'
      })),
      transition('active <=> inactive', animate('500ms ease-in-out'))
    ])
  ]
})
export class TargetEnvironmentCreateappStepComponent extends LauncherStep implements OnDestroy {
  @Input() id: string;

  private subscriptions: Subscription[] = [];
  private _targetEnvironments: TargetEnvironment[];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              private missionRuntimeService: MissionRuntimeService,
              private broadcaster: Broadcaster,
              public _DomSanitizer: DomSanitizer) {
    super();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    setTimeout(() => {
      this.restoreSummary();
    }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError

    this.subscriptions.push(this.targetEnvironmentService.getTargetEnvironments().subscribe((val) => {
      if (val !== undefined) {
        this._targetEnvironments = val;
      }
    }));
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.launcherComponent.summary.targetEnvironment !== undefined);
  }

  /**
   * Returns target environments to display
   *
   * @returns {TargetEnvironment[]} The target environments to display
   */
  get targetEnvironments(): TargetEnvironment[] {
    return this._targetEnvironments;
  }

  // Steps

  navToNextStep(): void {
    this.launcherComponent.navToNextStep();
  }

  selectCluster(cluster?: Cluster): void {
    this.launcherComponent.summary.cluster = cluster;
    this.broadcaster.broadcast('cluster', cluster);
  }

  updateTargetEnvSelection(target: TargetEnvironment): void {
    if (target.id === 'zip') {
      this.selectCluster(null);
    }
    this.initCompleted();
  }

  // Private

  private initCompleted(): void {
    this.completed = this.stepCompleted;
  }

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.launcherComponent.selectionParams;
    if (selection !== undefined) {
      this.launcherComponent.summary.targetEnvironment = selection.targetEnvironment;
      this.launcherComponent.summary.cluster = selection.cluster;
    }
    this.initCompleted(); // Ensure this is called for launcherComponent.targetEnvironment input
  }
}
