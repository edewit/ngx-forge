import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';
import { Selection } from '../../model/selection.model';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-missionruntime-createapp-step',
  templateUrl: './mission-runtime-createapp-step.component.html',
  styleUrls: ['./mission-runtime-createapp-step.component.less']
})
export class MissionRuntimeCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy {
  private _missions: Mission[] = [];
  private _runtimes: Runtime[] = [];

  private missionId: string;
  private runtimeId: string;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private missionRuntimeService: MissionRuntimeService,
              public _DomSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    this.subscriptions.push(this.missionRuntimeService.getMissions()
      .subscribe(missions => this._missions = missions));
      this.subscriptions.push(this.missionRuntimeService.getRuntimes()
      .subscribe(runtimes => this._runtimes = runtimes));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Accessors

  /**
   * Returns a list of missions to display
   *
   * @returns {Mission[]} The missions to display
   */
  get missions(): Mission[] {
    return this._missions;
  }

  /**
   * Returns a list of runtimes to display
   *
   * @returns {Runtime[]} The runtimes to display
   */
  get runtimes(): Runtime[] {
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
   * Returns runtime versions for the given runtime and selected mission
   *
   * Note that all versions are returned if a mission is not selected
   *
   * @param {Runtime} runtime
   * @returns {any[]}
   */
  getRuntimeVersions(runtime: Runtime): any[] {
    let result: any[] = [];
    let mission = this.launcherComponent.summary.mission; // selected mission
    if (mission === undefined) {
      // Get all runtime versions available
      runtime.missions.forEach((_mission) => {
        _mission.versions.forEach((version) => {
          if (result.length > 0) {
            let found = false;
            for (let i = 0; i < result.length; i++) {
              if (version.id === result[i].id) {
                found = true;
                break;
              }
            }
            if (!found) {
              result.push(version);
            }
          } else {
            result.push(version);
          }
        });
      });
    } else {
      for (let i = 0; i < runtime.missions.length; i++) {
        if (mission.id === runtime.missions[i].id) {
          runtime.missions[i].versions.forEach((version) => {
            result.push(version);
          });
        }
      }
    }
    return result;
  }

  /**
   * Returns true if mission choice should be disabled
   *
   * @param {Mission} mission The mission choice to test
   * @returns {boolean} True if mission choice should be disabled
   */
  isMissionDisabled(mission: Mission): boolean {
    if (this.launcherComponent.flow === 'osio') {
      return this.isMissionDisabledOSIO(mission);
    }
    let runtime = this.launcherComponent.summary.runtime; // selected runtime
    if (runtime === undefined) {
      return false; // Nothing should be disabled initially
    }

    let result = true;
    for (let i = 0; i < mission.runtimes.length; i++) {
      if (mission.runtimes[i] === runtime.id) {
        result = false;
        break;
      }
    }

    // Ensure selected version is complatible with mission
    if (!result) {
      result = true;
      if (runtime.version === undefined) {
        result = false;
      } else {
        for (let i = 0; i < runtime.missions.length; i++) {
          if (mission.id === runtime.missions[i].id) {
            for (let k = 0; k < runtime.missions[i].versions.length; k++) {
              let version = runtime.missions[i].versions[k];
              if (version !== undefined && version.id === runtime.version.id) {
                result = false;
                break;
              }
            }
            break;
          }
        }
      }
    }
    return result;
  }

  /**
   * Returns true if runtime choice should be disabled
   *
   * @param {Runtime} runtime The runtime choice to test
   * @returns {boolean} True if runtime choice should be disabled
   */
  isRuntimeDisabled(runtime: Runtime): boolean {
    if (this.launcherComponent.flow === 'osio') {
      return this.isRuntimeDisabledOSIO(runtime);
    }
    if (this.launcherComponent.summary.mission === undefined) {
      return false;
    }
    let result = true;
    let runtimes = this.launcherComponent.summary.mission.runtimes; // selected mission
    for (let i = 0; i < runtimes.length; i++) {
      if (runtime.id === runtimes[i]) {
        result = false;
        break;
      }
    }
    // Ensure runtime versions are not empty
    if (!result) {
      let mission = this.launcherComponent.summary.mission; // selected mission
      for (let i = 0; i < runtime.missions.length; i++) {
        if (mission.id === runtime.missions[i].id) {
          let versions = runtime.missions[i].versions;
          if (versions === undefined || versions.length === 0) {
            result = true;
            break;
          }
          for (let k = 0; k < versions.length; k++) {
            let version = versions[k];
            if (version === undefined || version.id === undefined || version.name === undefined) {
              result = true;
              break;
            }
          }
        }
      }
    }
    return result;
  }
  
  /**
   * Returns true if mission choice should be disabled
   * This is specfically targeting OSIO flow as here we don't have to consider versions of missions
   *
   * @param {Mission} mission The mission choice to test
   * @returns {boolean} True if mission choice should be disabled
   */
  isMissionDisabledOSIO(mission: Mission): boolean {
    let selectedRuntime: Runtime = this.launcherComponent.summary.runtime;
    if (selectedRuntime === undefined) {
      return false;
    }

    if (selectedRuntime && selectedRuntime.missions && selectedRuntime.missions.length) {
      let missions: Array<any> = selectedRuntime.missions;
      for (let i = 0; i < missions.length; ++ i) {
        if (missions[i].id === mission.id) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Returns true if runtime choice should be disabled
   * This is specfically targeting OSIO flow as here we don't have to consider versions of missions
   *
   * @param {Runtime} runtime The runtime choice to test
   * @returns {boolean} True if runtime choice should be disabled
   */
  isRuntimeDisabledOSIO(runtime: Runtime): boolean {
    let selectedMission: Mission = this.launcherComponent.summary.mission;
    if (selectedMission === undefined) {
      return false;
    }

    if (selectedMission && selectedMission.runtimes && selectedMission.runtimes.length) {
      let runtimes: Array<any> = selectedMission.runtimes;
      for (let i = 0; i < runtimes.length; ++ i) {
        if (runtimes[i] === runtime.id) {
          return false;
        }
      }
    }

    return true;
  }

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
    this.missionId = undefined;
    this.runtimeId = undefined;
    this.launcherComponent.summary.mission = undefined;
    this.launcherComponent.summary.runtime = undefined;
    this.initCompleted();
  }

  // Private

  private initCompleted(): void {
    this.completed = this.stepCompleted;
  }

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.launcherComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.missionId = selection.missionId;
    this.runtimeId = selection.runtimeId;

    if (this.missions) {
      this.missions.forEach((val) => {
        if (this.missionId === val.id) {
          this.updateMissionSelection(val);
        }
      });
    }

    if (this.runtimes) {
      this.runtimes.forEach((val) => {
        if (this.runtimeId === val.id) {
          this.updateRuntimeSelection(val);
          this.updateVersionSelection(val, selection.runtimeVersion);
        }
      });
    }

    this.initCompleted();
  }

  private updateMissionSelection(val: Mission): void {
    let artifactTS: Date = new Date();
    if (this.isMissionDisabled(val) === true) {
      return;
    }
    this.launcherComponent.summary.mission = val;
    this.missionId = val.id; // to support clicking anywhere in list item

    // set maven artifact
    if (this.launcherComponent && this.launcherComponent.summary &&
      this.launcherComponent.summary.mission && this.launcherComponent.summary.runtime &&
      this.launcherComponent.summary.mission.id && this.launcherComponent.summary.runtime.id) {
      let runtime = this.launcherComponent.summary.runtime.id.replace(/[.\-_]/g, '');
      let mission = this.launcherComponent.summary.mission.id.replace(/[.\-_]/g, '');
      this.launcherComponent.summary.dependencyCheck.mavenArtifact = 'booster' + '-' + mission + '-' + runtime
        + '-' + artifactTS.getTime();
    }
    // Clear selected version if not supported by mission
    this.runtimes.forEach((runtime) => {
      let found = false;
      let versions = this.getRuntimeVersions(runtime);
      for (let i = 0; i < versions.length; i++) {
        if (runtime.version !== undefined && runtime.version.id === versions[i].id) {
          found = true;
          break;
        }
      }
      if (!found && versions.length > 0) {
        // reset menu selection
        runtime.version = versions[0];

        // Reset launcher summary selection
        if (this.launcherComponent.summary.runtime !== undefined) {
          this.launcherComponent.summary.runtime.version = versions[0];
        }
      }
    });
    this.initCompleted();
  }

  private updateRuntimeSelection(val: Runtime): void {
    let artifactTS: Date = new Date();
    if (this.isRuntimeDisabled(val) === true) {
      return;
    }
    this.launcherComponent.summary.runtime = val;
    this.runtimeId = val.id; // to support clicking anywhere in list item

    // set maven artifact
    if (this.launcherComponent && this.launcherComponent.summary &&
      this.launcherComponent.summary.mission && this.launcherComponent.summary.runtime &&
      this.launcherComponent.summary.mission.id && this.launcherComponent.summary.runtime.id) {
      let runtime = this.launcherComponent.summary.runtime.id.replace(/[.\-_]/g, '');
      let mission = this.launcherComponent.summary.mission.id.replace(/[.\-_]/g, '');
      this.launcherComponent.summary.dependencyCheck.mavenArtifact = 'booster' + '-' + mission + '-' + runtime
        + '-' + artifactTS.getTime();
    }
    // Set summary version
    if (val.version !== undefined) {
      this.launcherComponent.summary.runtime.version = val.version;
    }
    this.initCompleted();
  }

  private updateVersionSelection(val: Runtime, version: any): void {
    val.version = version; // Don't update summary, just store selection
  }
}
