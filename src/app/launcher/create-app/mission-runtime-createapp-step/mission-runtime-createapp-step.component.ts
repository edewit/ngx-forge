import { Component, Host, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Booster, BoosterVersion } from '../../model/booster.model';
import { Broadcaster } from 'ngx-base';
import { Selection } from '../../model/selection.model';

export class ViewMission extends Mission {
  advanced: boolean;
  suggested: boolean;
  disabled: boolean = false;
  disabledReason?: string;
  prerequisite: boolean;
  community: boolean;
  showMore: boolean = false;
  boosters: Booster[];
}

export class ViewRuntime extends Runtime {
  disabled: boolean = false;
  disabledReason?: string;
  prerequisite: boolean;
  canChangeVersion: boolean;
  suggested: boolean;
  selectedVersion: { id: string; name: string; };
  versions: BoosterVersion[];
  showMore: boolean = false;
  boosters: Booster[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-missionruntime-createapp-step',
  templateUrl: './mission-runtime-createapp-step.component.html',
  styleUrls: ['./mission-runtime-createapp-step.component.less']
})
export class MissionRuntimeCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy {
  private _missions: ViewMission[] = [];
  private _runtimes: ViewRuntime[] = [];
  private _boosters: Booster[] = null;


  private missionId: string;
  private runtimeId: string;
  private versionId: string;

  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private missionRuntimeService: MissionRuntimeService,
              public _DomSanitizer: DomSanitizer,
              private broadcaster: Broadcaster) {
    super();
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    this.subscriptions.push(this.missionRuntimeService.getBoosters()
      .subscribe(boosters => {
        this._boosters = boosters;
        this.initBoosters();
        this.restoreFromSummary();
      }));
    this.broadcaster.on('cluster').subscribe(() => this.initBoosters());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  initBoosters(): void {
    this._runtimes = this.getViewRuntimes();
    this._missions = this.getViewMission();
    this.updateViewStatus();
    this.initCompleted();
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
  get stepCompleted(): boolean {
    return (this.launcherComponent.summary.mission !== undefined
      && this.launcherComponent.summary.runtime !== undefined
      && this.launcherComponent.summary.runtime.version !== undefined);
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.launcherComponent.navToNextStep();
  }

  /**
   * Reset current selections
   */
  resetSelections(): void {
    this.clearMission();
    this.clearRuntime();
    this.updateViewStatus();
    this.initCompleted();
  }

  selectBooster(mission?: ViewMission, runtime?: ViewRuntime, version?: BoosterVersion): void {
    if (mission) {
      this.missionId = mission.id;
      this.launcherComponent.summary.mission = mission;
    }
    if (runtime) {
      this.runtimeId = runtime.id;
      const newVersion =  version ? version : runtime.selectedVersion;
      this.versionId = newVersion.id;
      this.launcherComponent.summary.runtime = runtime;
      this.launcherComponent.summary.runtime.version = newVersion;

      // FIXME: use a booster change event listener to do this
      // set maven artifact
      if (this.launcherComponent.flow === 'osio' && this.stepCompleted) {
        const artifactTS: number = Date.now();
        const artifactRuntime = this.launcherComponent.summary.runtime.id.replace(/[.\-_]/g, '');
        const artifactMission = this.launcherComponent.summary.mission.id.replace(/[.\-_]/g, '');
        this.launcherComponent.summary.dependencyCheck.mavenArtifact = `booster-${artifactMission}-${artifactRuntime}-${artifactTS}`;
      }
    }
    this.updateViewStatus();
  }

  // Private

  private restoreFromSummary(): void {
    let selection: Selection = this.launcherComponent.selectionParams;
    if (!selection) {
      return;
    }
    const mission = this.missions.find(m => m.id === selection.missionId);
    const runtime = this.runtimes.find(r => r.id === selection.runtimeId);
    this.selectBooster(mission, runtime, selection.runtimeVersion);
  }

  private initCompleted(): void {
    this.completed = this.stepCompleted;
  }

  private getSelectedCluster(): string {
    if (this.launcherComponent.summary.targetEnvironment === 'os') {
      return _.get(this.launcherComponent.summary, 'cluster.type');
    }
    return null;
  }

  private getViewRuntimes(): ViewRuntime[] {
    const groupedByRuntime = _.groupBy(this._boosters, b => b.runtime.id);
    return _.values(groupedByRuntime).map(runtimeBoosters => {
      const runtime = _.first(runtimeBoosters).runtime;
      return {
        id: runtime.id,
        name: runtime.name,
        description: runtime.description,
        icon: runtime.icon,
        canChangeVersion: this.launcherComponent.flow === 'launch',
        suggested: _.get(runtime, 'metadata.suggested', false),
        prerequisite: _.get(runtime, 'metadata.prerequisite', false),
        showMore: false,
        boosters: runtimeBoosters
      } as ViewRuntime;
    });
  }

  private getViewMission(): ViewMission[] {
    const groupedByMission = _.groupBy(this._boosters, b => b.mission.id);
    return _.values(groupedByMission).map(missionBoosters => {
      const mission = _.first(missionBoosters).mission;
      return {
        id: mission.id,
        name: mission.name,
        description: mission.description,
        community: false, // FIXME implement this behavior if still needed
        advanced: _.get(mission, 'metadata.level') === 'advanced',
        suggested: _.get(mission, 'metadata.suggested', false),
        prerequisite: _.get(mission, 'metadata.prerequisite', false),
        showMore: false,
        boosters: missionBoosters
      } as ViewMission;
    });
  }

  private updateViewStatus(): void {
    const cluster = this.getSelectedCluster();
    this._missions.forEach(mission => {
      const availableBoosters = MissionRuntimeService.getAvailableBoosters(mission.boosters, cluster, mission.id, this.runtimeId, this.versionId);
      if (this.missionId === mission.id && availableBoosters.empty) {
        this.clearMission();
      }
      mission.disabled = availableBoosters.empty;
      mission.disabledReason = availableBoosters.emptyReason;
    });
    this._runtimes.forEach(runtime => {
      const availableBoosters = MissionRuntimeService.getAvailableBoosters(runtime.boosters, cluster, this.missionId, runtime.id);
      const versions = _.uniq(availableBoosters.boosters.map(b => b.version));
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
      // Reset selected runtime and version since it is not available
      this.clearRuntime();
    }
    return this.missionRuntimeService.getDefaultVersion(runtimeId, versions);
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
