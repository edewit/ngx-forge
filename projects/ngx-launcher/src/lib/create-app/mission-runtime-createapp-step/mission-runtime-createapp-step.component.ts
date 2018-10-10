import { Component, Host, OnDestroy, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';
import { EmptyReason, MissionRuntimeService } from '../../service/mission-runtime.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Booster, BoosterVersion } from '../../model/booster.model';
import { Selection } from '../../model/selection.model';
import {
  createViewMissions,
  createViewRuntimes,
  ViewMission,
  ViewRuntime
} from './mission-runtime-createapp-step.model';
import { broadcast } from '../../shared/telemetry.decorator';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-missionruntime-createapp-step',
  templateUrl: './mission-runtime-createapp-step.component.html',
  styleUrls: ['./mission-runtime-createapp-step.component.less']
})
export class MissionRuntimeCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy, AfterViewInit {
  public missionId: string;
  public runtimeId: string;
  public canChangeVersion: boolean;

  versionId: string;

  disabledReason = EmptyReason;
  private _missions: ViewMission[] = [];
  private _runtimes: ViewRuntime[] = [];
  private _boosters: Booster[] = null;
  private _cluster: string;

  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private missionRuntimeService: MissionRuntimeService,
              public _DomSanitizer: DomSanitizer,
              private broadcaster: Broadcaster) {
    super(launcherComponent);
    this.canChangeVersion = this.launcherComponent.flow === 'launch';
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
  }

  ngAfterViewInit() {
    this.subscriptions.push(this.missionRuntimeService.getBoosters()
      .subscribe(boosters => {
        this._boosters = boosters;
        this.initBoosters();
        this.restoreFromSummary();
      }));
    this.subscriptions.push(this.broadcaster.on('cluster').subscribe(() => this.initBoosters()));
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
    return this._cluster;
  }

  /**
   * Returns indicator for at least one selection has been made
   *
   * @returns {boolean} True at least one selection has been made
   */
  get selectionAvailable(): boolean {
    return (this.launcherComponent.summary.mission !== undefined
      || this.launcherComponent.summary.runtime !== undefined);
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    return (this.launcherComponent.summary.mission !== undefined
      && this.launcherComponent.summary.runtime !== undefined
      && this.launcherComponent.summary.runtime.version !== undefined);
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
      this.missionId = mission.id;
      this.launcherComponent.summary.mission = mission;
    }
    if (runtime && !runtime.disabled) {
      this.runtimeId = runtime.id;
      const newVersion =  version ? version : runtime.selectedVersion;
      this.versionId = newVersion.id;
      this.launcherComponent.summary.runtime = runtime;
      this.launcherComponent.summary.runtime.version = newVersion;
      // FIXME: use a booster change event listener to do this
      // set maven artifact
      if (this.launcherComponent.flow === 'osio' && this.completed) {
        this.launcherComponent.summary.dependencyCheck.mavenArtifact = this.createMavenArtifact();
      }
      this.broadcaster.broadcast('runtime-changed', runtime);
    }
    this.handleBlankMissionFlow();
    this.updateBoosterViewStatus();
  }

  handleBlankMissionFlow(): void {
    if (this.launcherComponent.summary.mission && this.launcherComponent.summary.runtime &&
      this.launcherComponent.summary.mission.id === 'blank-mission') {
      const runtimeSp: any = this.launcherComponent.summary.runtime;
      if (runtimeSp && runtimeSp.boosters && runtimeSp.boosters.length > 0) {
        const supportedMission: any = runtimeSp.boosters[0];
        this.launcherComponent.summary.mission.meta = supportedMission.mission.id;
      }
    }
  }

  // Private

  private createMavenArtifact(): string {
    const artifactTS: number = Date.now();
    const artifactRuntime = this.launcherComponent.summary.runtime.id.replace(/[.\-_]/g, '');
    const artifactMission = this.launcherComponent.summary.mission.id.replace(/[.\-_]/g, '');
    return `booster-${artifactMission}-${artifactRuntime}-${artifactTS}`;
  }

  private restoreFromSummary(): void {
    const selection: Selection = this.launcherComponent.selectionParams;
    if (!selection) {
      return;
    }
    const mission = this.missions.find(m => m.id === selection.missionId);
    const runtime = this.runtimes.find(r => r.id === selection.runtimeId);
    this.selectBooster(mission, runtime, selection.runtimeVersion);
  }

  private getSelectedCluster(): string {
    if (this.launcherComponent.summary.targetEnvironment === 'os') {
      return _.get(this.launcherComponent.summary, 'cluster.type');
    }
    return null;
  }

  private updateBoosterViewStatus(): void {
    this._cluster = this.getSelectedCluster();
    this._missions.forEach(mission => {
      let availableBoosters = MissionRuntimeService.getAvailableBoosters(mission.boosters,
        this._cluster, mission.id);
      if (availableBoosters.empty) {
        mission.shrinked = true;
      } else {
        availableBoosters = MissionRuntimeService.getAvailableBoosters(mission.boosters,
          this._cluster, mission.id, this.runtimeId);
      }
      mission.disabled = availableBoosters.empty;
      mission.disabledReason = availableBoosters.emptyReason;
      mission.community = this.launcherComponent.flow === 'osio' && !mission.disabled && this.versionId === 'community';
      if (this.missionId === mission.id && availableBoosters.empty) {
        this.clearMission();
      }
    });
    this._runtimes.forEach(runtime => {
      const availableBoosters = MissionRuntimeService.getAvailableBoosters(runtime.boosters,
        this._cluster, this.missionId, runtime.id);
      const versions = _.chain(availableBoosters.boosters)
        .map(b => b.version)
        .uniq()
        .value()
        .sort(MissionRuntimeService.compareVersions);
      if (this.runtimeId === runtime.id && availableBoosters.empty) {
        this.clearRuntime();
      }
      runtime.disabled = availableBoosters.empty;
      runtime.disabledReason = availableBoosters.emptyReason;
      runtime.versions = versions;
      runtime.selectedVersion = this.getRuntimeSelectedVersion(runtime.id, versions);
    });
  }

  private getRuntimeSelectedVersion(runtimeId: string, versions: BoosterVersion[]): BoosterVersion {
    if (this.runtimeId === runtimeId && this.versionId) {
      const selectedVersion = versions.find(v => v.id === this.versionId);
      if (selectedVersion) {
        return selectedVersion;
      }
      // If the current selected version is not compatible, auto select the first available version
      const autoSelectedVersion = _.first(versions);
      this.versionId = autoSelectedVersion.id;
      return autoSelectedVersion;
    }
    return _.first(versions);
  }

  private clearRuntime(): void {
    this.runtimeId = undefined;
    this.versionId = undefined;
    this.launcherComponent.summary.runtime = undefined;
  }

  private clearMission(): void {
    this.missionId = undefined;
    this.launcherComponent.summary.mission = undefined;
  }
}
