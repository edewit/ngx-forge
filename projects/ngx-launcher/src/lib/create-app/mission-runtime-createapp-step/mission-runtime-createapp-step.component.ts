import { Component, Host, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { Mission } from '../../model/mission.model';
import { EmptyReason, MissionRuntimeService } from '../../service/mission-runtime.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Booster, BoosterVersion, BoosterState } from '../../model/booster.model';
import {
  createViewMissions,
  createViewRuntimes,
  ViewMission,
  ViewRuntime
} from './mission-runtime-createapp-step.model';
import { broadcast } from '../../shared/telemetry.decorator';
import { MissionRuntimeCreateappReviewComponent } from './mission-runtime-createapp-review.component';
import { Projectile, StepState, Filter } from '../../model/summary.model';
import { Cluster } from '../../model/cluster.model';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-missionruntime-createapp-step',
  templateUrl: './mission-runtime-createapp-step.component.html',
  styleUrls: ['./mission-runtime-createapp-step.component.less']
})
export class MissionRuntimeCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy {
  private booster: BoosterState = { mission: new Mission(), runtime: { id: undefined, name: undefined,
    version: {id: undefined, name: undefined} } };
  public canChangeVersion: boolean;

  disabledReason = EmptyReason;
  private _missions: ViewMission[] = [];
  private _runtimes: ViewRuntime[] = [];
  private _boosters: Booster[] = null;
  private _cluster: Cluster;

  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private missionRuntimeService: MissionRuntimeService,
              public _DomSanitizer: DomSanitizer,
              private projectile: Projectile<BoosterState>,
              private broadcaster: Broadcaster) {
    super(launcherComponent, MissionRuntimeCreateappReviewComponent, projectile);
    this.canChangeVersion = this.launcherComponent.flow === 'launch';
  }

  ngOnInit() {
    const state = new StepState<BoosterState>(this.booster,
      [
        {name: 'missionId', value: 'mission.id'} as Filter,
        {name: 'runtimeId', value: 'runtime.id'} as Filter,
        {name: 'versionId', value: 'runtime.version.id'} as Filter
      ]
    );
    this.projectile.setState(this.id, state);
    this.launcherComponent.addStep(this);
    this.subscriptions.push(this.missionRuntimeService.getBoosters()
      .subscribe(boosters => {
        this._boosters = boosters;
        this.initBoosters();
        this.restore();
      }));
    this.subscriptions.push(this.broadcaster.on<Cluster>('cluster').subscribe(cluster => {
      this._cluster = cluster;
      this.initBoosters();
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  initBoosters(): void {
    this._runtimes = createViewRuntimes(this._boosters);
    this._missions = createViewMissions(this._boosters);
    this.updateBoosterViewStatus();
  }

// Accessors

  /**
   * Returns a list of missions to display
   *
   * @returns {Mission[]} The missions to display
   */
  get missions(): ViewMission[] {
    return this._missions;
  }

  /**
   * Returns a list of runtimes to display
   *
   * @returns {Runtime[]} The runtimes to display
   */
  get runtimes(): ViewRuntime[] {
    return this._runtimes;
  }

  get cluster(): string {
    return this._cluster ? this._cluster.type : '';
  }

  /**
   * Returns indicator for at least one selection has been made
   *
   * @returns {boolean} True at least one selection has been made
   */
  get selectionAvailable(): boolean {
    return (this.booster.mission !== undefined
      || this.booster.runtime !== undefined);
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    return (this.booster.mission.id !== undefined
      && this.booster.runtime.id !== undefined
      && this.booster.runtime.version.id !== undefined);
  }

  // Steps

  /**
   * Navigate to next step
   */
  @broadcast('completeMissionRuntimeStep', {
    'launcherComponent.summary': {
      mission: 'mission.name',
      runtime: 'runtime.name'
    }
  })
  navToNextStep(): void {
    this.launcherComponent.navToNextStep('MissionRuntime');
  }

  /**
   * Reset current selections
   */
  resetSelections(): void {
    this.clearMission();
    this.clearRuntime();
    this.updateBoosterViewStatus();
  }

  selectBooster(mission?: ViewMission, runtime?: ViewRuntime, version?: BoosterVersion): void {
    if (mission && !mission.disabled) {
      this.booster.mission = mission;
    }
    if (runtime && !runtime.disabled) {
      this.booster.runtime = runtime;
      const newVersion = version ? version : runtime.selectedVersion;
      this.booster.runtime.version = newVersion;
      if (this.completed) {
        this.broadcaster.broadcast('booster-changed', this.booster);
      }
      this.broadcaster.broadcast('runtime-changed', runtime);
    }

    this.handleBlankMissionFlow();
    this.updateBoosterViewStatus();
  }

  handleBlankMissionFlow(): void {
    if (this.booster.mission && this.booster.runtime &&
      this.booster.mission.id === 'blank-mission') {
      const runtimeSp: any = this.booster.runtime;
      if (runtimeSp && runtimeSp.boosters && runtimeSp.boosters.length > 0) {
        const supportedMission: any = runtimeSp.boosters[0];
        this.booster.mission.meta = supportedMission.mission.id;
      }
    }
  }

  restoreModel(model: any): void {
    const mission = this.missions.find(m => m.id === model.missionId);
    const runtime = this.runtimes.find(r => r.id === model.runtimeId);
    const version = runtime.versions.find(v => v.id === model.versionId);
    this.selectBooster(mission, runtime, version);
  }

  private updateBoosterViewStatus(): void {
    const cluster = this.cluster;
    this._missions.forEach(mission => {
      let availableBoosters = MissionRuntimeService.getAvailableBoosters(mission.boosters,
        cluster, mission.id);
      if (availableBoosters.empty) {
        mission.shrinked = true;
      } else {
        availableBoosters = MissionRuntimeService.getAvailableBoosters(mission.boosters,
          cluster, mission.id, this.booster.runtime ? this.booster.runtime.id : undefined);
      }
      mission.disabled = availableBoosters.empty;
      mission.disabledReason = availableBoosters.emptyReason;
      mission.community = this.launcherComponent.flow === 'osio' && !mission.disabled && this.booster.runtime.version.id === 'community';
      if (this.booster.mission && this.booster.mission.id === mission.id && availableBoosters.empty) {
        this.clearMission();
      }
    });
    this._runtimes.forEach(runtime => {
      const availableBoosters = MissionRuntimeService.getAvailableBoosters(runtime.boosters,
        cluster, this.booster.mission ? this.booster.mission.id : undefined, runtime.id);
      const versions = _.chain(availableBoosters.boosters)
        .map(b => b.version)
        .uniq()
        .value()
        .sort(MissionRuntimeService.compareVersions);
      if (this.booster.runtime && this.booster.runtime.id === runtime.id && availableBoosters.empty) {
        this.clearRuntime();
      }
      runtime.disabled = availableBoosters.empty;
      runtime.disabledReason = availableBoosters.emptyReason;
      runtime.versions = versions;
      runtime.selectedVersion = this.getRuntimeSelectedVersion(runtime.id, versions);
    });
  }

  private getRuntimeSelectedVersion(runtimeId: string, versions: BoosterVersion[]): BoosterVersion {
    if (this.booster.runtime && this.booster.runtime.id === runtimeId && this.booster.runtime.version.id) {
      const selectedVersion = versions.find(v => v.id === this.booster.runtime.version.id);
      if (selectedVersion) {
        return selectedVersion;
      }
      // If the current selected version is not compatible, auto select the first available version
      const autoSelectedVersion = _.first(versions);
      this.booster.runtime.version.id = autoSelectedVersion.id;
      return autoSelectedVersion;
    }
    return _.first(versions);
  }

  private clearRuntime(): void {
    this.booster.runtime = { id: undefined, name: undefined,
      version: {id: undefined, name: undefined} };
  }

  private clearMission(): void {
    this.booster.mission = new Mission();
  }
}
