import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Booster, BoosterRuntime, BoosterVersion } from '../../model/booster.model';
import { Broadcaster } from 'ngx-base';
import { Selection } from '../../model/selection.model';

export class ViewMission {
  id: string;
  name: string;
  description?: string;
  advanced: boolean;
  suggested: boolean;
  disabled: boolean;
  disabledReason?: string;
  prerequisite: boolean;
  community: boolean;
  showMore: boolean;
}

export class ViewRuntime {
  id: string;
  name: string;
  description?: string;
  icon: string;
  disabled: boolean;
  disabledReason?: string;
  prerequisite: boolean;
  canChangeVersion: boolean;
  suggested: boolean;
  selectedVersion: { id: string; name: string; };
  versions: {
    id: string;
    name: string;
  }[];
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
        this.updateSelection();
        this.restoreFromSummary();
      }));
    this.broadcaster.on('cluster').subscribe(() => this.updateSelection());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  updateSelection(): void {
    const cluster = this.getSelectedCluster();
    this._runtimes = this.getViewRuntimes(cluster);
    this._missions = this.getViewMission(cluster);
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
    this.updateSelection();
    this.initCompleted();
  }

  selectMission(mission: ViewMission): void {
    this.missionId = mission.id;
    this.launcherComponent.summary.mission = {
      id: mission.id,
      name: mission.name,
      description: mission.description
    };
    this.updateSelection();
  }

  selectRuntime(runtime: ViewRuntime, version?: BoosterVersion): void {
    this.runtimeId = runtime.id;
    const newVersion =  version ? version : runtime.selectedVersion;
    this.versionId = newVersion.id;
    this.launcherComponent.summary.runtime = {
      id: runtime.id,
      name: runtime.name,
      description: runtime.description,
      icon: runtime.icon,
      version: newVersion
    };
    this.updateSelection();

    // FIXME: use a booster change event listener to do this
    // set maven artifact
    if (this.stepCompleted) {
      let artifactTS: Date = new Date();
      let runtime = this.launcherComponent.summary.runtime.id.replace(/[.\-_]/g, '');
      let mission = this.launcherComponent.summary.mission.id.replace(/[.\-_]/g, '');
      this.launcherComponent.summary.dependencyCheck.mavenArtifact = 'booster' + '-' + mission + '-' + runtime
        + '-' + artifactTS.getTime();
    }
  }

  // Private

  private restoreFromSummary(): void {
    let selection: Selection = this.launcherComponent.selectionParams;
    if (!selection) {
      return;
    }
    const mission = this.missions.find(m => m.id === selection.missionId);
    if (mission) {
      this.selectMission(mission);
    }
    const runtime = this.runtimes.find(r => r.id === selection.runtimeId);
    if (runtime) {
      this.selectRuntime(runtime, selection.runtimeVersion);
    }
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

  private getViewRuntimes(cluster?: string) {
    const groupedByRuntime = _.groupBy(this._boosters, b => b.runtime.id);
    return _.values(groupedByRuntime).map(runtimeBoosters => {
      const runtime = _.first(runtimeBoosters).runtime;
      const availableBoosters = MissionRuntimeService.getAvailableBoosters(runtimeBoosters, cluster, this.missionId, runtime.id);
      const versions = _.uniq(availableBoosters.boosters.map(b => b.version));
      if (this.runtimeId === runtime.id && availableBoosters.empty) {
        this.clearRuntime();
      }
      return {
        id: runtime.id,
        name: runtime.name,
        description: runtime.description,
        icon: runtime.icon,
        canChangeVersion: this.launcherComponent.flow === 'launch',
        suggested: runtime.metadata.suggested,
        prerequisite: runtime.metadata.prerequisite,
        disabled: availableBoosters.empty,
        disabledReason: availableBoosters.emptyReason,
        selectedVersion: this.getRuntimeSelectedVersion(runtime, versions),
        versions: versions,
        showMore: false
      };
    });
  }

  private getRuntimeSelectedVersion(runtime: BoosterRuntime, versions: BoosterVersion[]): BoosterVersion {
    if (this.runtimeId === runtime.id && this.versionId) {
      const selectedVersion = versions.find(v => v.id === this.versionId);
      if (selectedVersion) {
        return selectedVersion;
      }
      // Reset selected runtime and version since it is not available
      this.clearRuntime();
    }
    return this.missionRuntimeService.getDefaultVersion(runtime, versions);
  }

  private getViewMission(cluster?: string) {
    const groupedByMission = _.groupBy(this._boosters, b => b.mission.id);
    return _.values(groupedByMission).map(missionBoosters => {
      const mission = _.first(missionBoosters).mission;
      const availableBoosters = MissionRuntimeService.getAvailableBoosters(missionBoosters, cluster, mission.id, this.runtimeId, this.versionId);
      if (this.missionId === mission.id && availableBoosters.empty) {
        this.clearMission();
      }
      return {
        id: mission.id,
        name: mission.name,
        description: mission.description,
        prerequisite: mission.metadata.prerequisite,
        community: false, // FIXME implement this behavior if still needed
        advanced: mission.metadata.level === 'advanced',
        suggested: mission.metadata.suggested,
        disabled: availableBoosters.empty,
        disabledReason: availableBoosters.emptyReason,
        showMore: false
      };
    });
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
