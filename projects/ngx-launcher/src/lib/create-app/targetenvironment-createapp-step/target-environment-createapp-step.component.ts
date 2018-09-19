import {
  Component,
  Host,
  Input,
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
import { TargetEnvironmentCreateappReviewComponent } from './target-environment-createapp-review.component';

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
  private _clusters: Cluster[] = [];

  private selection: TargetEnvironmentSelection = new TargetEnvironmentSelection();
  constructor(@Host() public launcherComponent: LauncherComponent,
              private targetEnvironmentService: TargetEnvironmentService,
              @Optional() private tokenService: TokenService,
              private broadcaster: Broadcaster,
              private projectile: Projectile<any>,
              private route: ActivatedRoute,
              public _DomSanitizer: DomSanitizer) {
    super(TargetEnvironmentCreateappReviewComponent, projectile);
    this.selection.dependencyCheck.projectName = this.route.snapshot.params['projectName'];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {
    const state = new StepState(this.selection, [
      { name: 'targetEnvironment', value: 'targetEnvironment' },
      { name: 'clusterId', value: 'cluster.id' },
      { name: 'dependencyCheck', value: 'dependencyCheck' }
    ]);
    this.projectile.setState(this.id, state);
    this.launcherComponent.addStep(this);
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
      const artifactRuntime = booster.runtime.id.replace(/[.\-_]/g, '');
      const artifactMission = booster.mission.id.replace(/[.\-_]/g, '');
      this.selection.dependencyCheck.mavenArtifact = `booster-${artifactMission}-${artifactRuntime}`;
    }));
    this.subscriptions.push(this.broadcaster.on<string>('name-changed').subscribe(projectName => {
      this.selection.dependencyCheck.projectName = projectName;
    }));
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    return this.selection.targetEnvironment
      && (this.selection.targetEnvironment === 'zip' || !!this.selection.cluster);
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

  // Private
  restoreModel(model: any): void {
    this.selection.targetEnvironment = model.targetEnvironment;
    this.selection.cluster = this._clusters.find(c => c.id === model.clusterId);
    this.selection.dependencyCheck = model.dependencyCheck;
    this.broadcaster.broadcast('name-changed', model.dependencyCheck.projectName);
  }

  private clusterSortFn(a: Cluster, b: Cluster): number {
    if (a.connected) {
      return -1;
    }
    return a.name.localeCompare(b.name);
  }
}
