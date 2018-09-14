import {
  Component,
  Host,
  Input,
  OnDestroy, OnInit, Optional,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { TargetEnvironment } from '../../model/target-environment.model';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';
import { Projectile } from '../../model/summary.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-createapp-step',
  templateUrl: './target-environment-createapp-step.component.html',
  styleUrls: ['./target-environment-createapp-step.component.less']
})
export class TargetEnvironmentCreateappStepComponent extends LauncherStep implements OnDestroy, OnInit {
  @Input() id: string;

  private subscriptions: Subscription[] = [];
  private _targetEnvironments: TargetEnvironment[];
  targetEnvironment: string;
  private _clusters: Cluster[] = [];
  public cluster: Cluster;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              @Optional() private tokenService: TokenService,
              private broadcaster: Broadcaster,
              private projectile: Projectile,
              public _DomSanitizer: DomSanitizer) {
    super(null, projectile);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    setTimeout(() => {
      this.restore();
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
  get completed(): boolean {
    return this.targetEnvironment
      && (this.targetEnvironment === 'zip' || !!this.cluster);
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
    this.launcherComponent.navToNextStep('TargetEnvironment');
  }

  selectCluster(cluster?: Cluster): void {
    this.cluster = cluster;
    this.broadcaster.broadcast('cluster', cluster);
  }

  updateTargetEnvSelection(target: TargetEnvironment): void {
    if (target.id === 'zip') {
      this.selectCluster(null);
    }
  }

  // Private
  restoreModel(model: any): void {
    this.targetEnvironment = model.targetenvironment;
    this.cluster = model.cluster;
  }

  saveModel(): any {
    return { targetenvironment: this.targetEnvironment, cluster: this.cluster };
  }

  private clusterSortFn(a: Cluster, b: Cluster): number {
    if (a.connected) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  }
}
