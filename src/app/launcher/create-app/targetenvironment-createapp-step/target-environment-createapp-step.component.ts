import {
  animate,
  Component,
  Host,
  Input,
  OnDestroy, Optional,
  state,
  style,
  transition,
  trigger,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Broadcaster } from 'ngx-base';

import { Selection } from '../../model/selection.model';
import { TargetEnvironment } from '../../model/target-environment.model';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-createapp-step',
  templateUrl: './target-environment-createapp-step.component.html',
  styleUrls: ['./target-environment-createapp-step.component.less']
})
export class TargetEnvironmentCreateappStepComponent extends LauncherStep implements OnDestroy {
  @Input() id: string;

  private subscriptions: Subscription[] = [];
  private _targetEnvironments: TargetEnvironment[];
  private _clusters: Cluster[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              @Optional() private tokenService: TokenService,
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
    if (this.tokenService) {
      this.subscriptions.push(this.tokenService.clusters.subscribe(clusters => {
        this._clusters = clusters.sort(this.clusterSortFn);
      }));
    }
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
    return this.launcherComponent.summary.targetEnvironment
      && (this.launcherComponent.summary.targetEnvironment === 'zip' || !!this.launcherComponent.summary.cluster);
  }

  /**
   * Returns target environments to display
   *
   * @returns {TargetEnvironment[]} The target environments to display
   */
  get targetEnvironments(): TargetEnvironment[] {
    return this._targetEnvironments;
  }

  /**
   * Returns clusters to display
   *
   * @returns {Cluster[]} The clusters to display
   */
  get clusters(): Cluster[] {
    return this._clusters;
  }

  // Steps

  navToNextStep(): void {
    this.launcherComponent.navToNextStep();
  }

  selectCluster(cluster?: Cluster): void {
    this.launcherComponent.summary.cluster = cluster;
    this.broadcaster.broadcast('cluster', cluster);
    this.initCompleted();
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

  private clusterSortFn(a: Cluster, b: Cluster): number {
    if (a.connected) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  }
}
