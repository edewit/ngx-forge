import {
  Component,
  Host,
  OnDestroy, OnInit, Optional,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Broadcaster } from 'ngx-base';
import { Subscription } from 'rxjs';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Booster } from '../../model/booster.model';
import { Cluster } from '../../model/cluster.model';
import { Projectile, StepState } from '../../model/projectile.model';
import { Runtime } from '../../model/runtime.model';
import { TargetEnvironment, TargetEnvironmentSelection } from '../../model/target-environment.model';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { TokenService } from '../../service/token.service';

import * as _ from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-step',
  templateUrl: './target-environment-step.component.html',
  styleUrls: ['./target-environment-step.component.less']
})
export class TargetEnvironmentStepComponent extends LauncherStep implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];
  private _targetEnvironments: TargetEnvironment[];
  private _clusters: Cluster[] = [];

  selection: TargetEnvironmentSelection = new TargetEnvironmentSelection();
  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              @Optional() private tokenService: TokenService,
              private dependencyCheckService: DependencyCheckService,
              private broadcaster: Broadcaster,
              private projectile: Projectile<any>,
              public _DomSanitizer: DomSanitizer) {
    super(projectile);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    this.selection.dependencyCheck = this.projectile.sharedState.state;
    const state = new StepState(this.selection, [
      { name: 'clusterId', value: 'cluster.id', restorePath: 'clusters.id' }
    ]);
    this.projectile.setState(this.id, state);
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    if (this.tokenService) {
      this.subscriptions.push(this.tokenService.clusters.subscribe(clusters => {
        this._clusters = clusters.sort(this.clusterSortFn);
        this.restore(this);
      }));
    }
    this.subscriptions.push(this.targetEnvironmentService.getTargetEnvironments().subscribe((val) => {
      if (val !== undefined) {
        this._targetEnvironments = val;
      }
    }));
    this.subscriptions.push(this.broadcaster.on<Booster>('booster-changed').subscribe(booster => {
      this.updateArtifactInfo(booster.runtime.id, booster.mission.id);
    }));
    this.subscriptions.push(this.broadcaster.on<Runtime>('runtime-changed').subscribe(runtime => {
      this.updateArtifactInfo(runtime.id);
    }));
  }

  private updateArtifactInfo(runtimeId: string, missionId?: string) {
    if (runtimeId !== 'nodejs') {
      const artifactRuntime = runtimeId.replace(/[.\-_]/g, '');
      const artifactMission = missionId ? (missionId.replace(/[.\-_]/g, '') + '-') : '';
      this.selection.dependencyCheck.mavenArtifact = `newapp-${artifactMission}${artifactRuntime}`;
      this.subscriptions.push(this.dependencyCheckService.getDependencyCheck()
        .subscribe((val) => {
          _.defaults(this.selection.dependencyCheck, val);
        }));
    } else {
      this.selection.dependencyCheck.mavenArtifact = undefined;
      this.selection.dependencyCheck.groupId = undefined;
      this.selection.dependencyCheck.projectVersion = '1.0.0';
    }
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    return this.selection.dependencyCheck.targetEnvironment
      && (this.selection.dependencyCheck.targetEnvironment === 'zip' || !!this.selection.cluster);
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

  selectCluster(cluster?: Cluster): void {
    this.selection.cluster = cluster;
    this.broadcaster.broadcast('cluster', cluster);
  }

  updateTargetEnvSelection(target: TargetEnvironment): void {
    if (target.id === 'zip') {
      this.selectCluster(null);
    }
  }

  private clusterSortFn(a: Cluster, b: Cluster): number {
    if (a.connected) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  }
}
