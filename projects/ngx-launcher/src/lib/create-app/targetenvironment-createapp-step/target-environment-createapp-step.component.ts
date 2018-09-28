import {
  Component,
  Host,
  OnDestroy, OnInit, Optional,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { TargetEnvironment, TargetEnvironmentSelection } from '../../model/target-environment.model';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Cluster } from '../../model/cluster.model';
import { TokenService } from '../../service/token.service';
import { Projectile, StepState } from '../../model/summary.model';

import * as _ from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-targetenvironment-createapp-step',
  templateUrl: './target-environment-createapp-step.component.html',
  styleUrls: ['./target-environment-createapp-step.component.less']
})
export class TargetEnvironmentCreateappStepComponent extends LauncherStep implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];
  private _targetEnvironments: TargetEnvironment[];
  private _clusters: Cluster[] = [];

  selection: TargetEnvironmentSelection = new TargetEnvironmentSelection();
  constructor(@Host() public launcherComponent: LauncherComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              @Optional() private tokenService: TokenService,
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
    _.merge(this.projectile.sharedState.state, {
      mavenArtifact: 'booster',
      groupId: 'io.openshift.booster',
      projectVersion: '1.0.0-SNAPSHOT'
    });
    const state = new StepState(this.selection, [
      { name: 'clusterId', value: 'cluster.id' }
    ]);
    this.projectile.setState(this.id, state);
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    if (this.tokenService) {
      this.subscriptions.push(this.tokenService.clusters.subscribe(clusters => {
        this.restore();
        this._clusters = clusters.sort(this.clusterSortFn);
      }));
    }
    this.subscriptions.push(this.targetEnvironmentService.getTargetEnvironments().subscribe((val) => {
      if (val !== undefined) {
        this._targetEnvironments = val;
      }
    }));
    this.subscriptions.push(this.broadcaster.on<any>('booster-changed').subscribe(booster => {
      if (booster.runtime.id !== 'nodejs') {
        const artifactRuntime = booster.runtime.id.replace(/[.\-_]/g, '');
        const artifactMission = booster.mission.id.replace(/[.\-_]/g, '');
        this.selection.dependencyCheck.mavenArtifact = `booster-${artifactMission}-${artifactRuntime}`;
      } else {
        this.selection.dependencyCheck.mavenArtifact = undefined;
        this.selection.dependencyCheck.groupId = undefined;
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

  navToNextStep(): void {
    this.launcherComponent.navToNextStep('TargetEnvironment');
  }

  selectCluster(cluster?: Cluster): void {
    this.selection.cluster = cluster;
    this.broadcaster.broadcast('cluster', cluster);
  }

  updateTargetEnvSelection(target: TargetEnvironment): void {
    if (target.id === 'zip') {
      this.selectCluster(null);
    }
  }

  restoreModel(model: any): void {
    this.selection.cluster = this._clusters.find(c => c.id === model.clusterId);
    this.selection.dependencyCheck = this.projectile.sharedState.state;
  }

  private clusterSortFn(a: Cluster, b: Cluster): number {
    if (a.connected) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  }
}
