import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Mission } from '../model/mission.model';
import { Runtime } from '../model/runtime.model';
import { Selection } from '../model/selection.model';
import { MissionRuntimeService } from '../service/mission-runtime.service';
import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-missionruntime-step',
  templateUrl: './mission-runtime-step.component.html',
  styleUrls: ['./mission-runtime-step.component.less']
})
export class MissionRuntimeStepComponent extends WizardStep implements OnInit, OnDestroy {
  private _missions: Mission[];
  private _runtimes: Runtime[];

  private missionId: string;
  private runtimeId: string;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private missionRuntimeService: MissionRuntimeService,
              public _DomSanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
    setTimeout(() => {
      this.restoreSummary();
    }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError

    this.subscriptions.push(this.missionRuntimeService.getMissions().subscribe((result) => {
      this._missions = result;
    }));
    this.subscriptions.push(this.missionRuntimeService.getRuntimes().subscribe((result) => {
      this._runtimes = result;
      this._runtimes.forEach((runtime) => {
        runtime.version = this.getRuntimeVersions(runtime)[0]; // set default menu selection
      });
    }));
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
    return (this.wizardComponent.summary.mission !== undefined
      || this.wizardComponent.summary.runtime !== undefined);
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.wizardComponent.summary.mission !== undefined
      && this.wizardComponent.summary.runtime !== undefined
      && this.wizardComponent.summary.runtime.version !== undefined);
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
    if (this.wizardComponent.summary.mission === undefined) {
      // Get all runtime versions available
      runtime.missions.forEach((mission) => {
        mission.versions.forEach((version) => {
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
      let mission = this.wizardComponent.summary.mission; // selected mission
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
    let runtime = this.wizardComponent.summary.runtime; // selected runtime
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
    if (this.wizardComponent.summary.mission === undefined) {
      return false;
    }
    let result = true;
    let runtimes = this.wizardComponent.summary.mission.runtimes; // selected mission
    for (let i = 0; i < runtimes.length; i++) {
      if (runtime.id === runtimes[i]) {
        result = false;
        break;
      }
    }
    // Ensure runtime versions are not empty
    if (!result) {
      let mission = this.wizardComponent.summary.mission; // selected mission
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
   * Navigate to next step
   */
  navToNextStep(): void {
    this.wizardComponent.navToNextStep();
  }

  /**
   * Reset current selections
   */
  resetSelections(): void {
    this.missionId = undefined;
    this.runtimeId = undefined;
    this.wizardComponent.summary.mission = undefined;
    this.wizardComponent.summary.runtime = undefined;
    this.initCompleted();
  }

  // Private

  private initCompleted(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
  }

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.missionId = selection.missionId;
    this.runtimeId = selection.runtimeId;

    this.missions.forEach((val) => {
      if (this.missionId === val.id) {
        this.updateMissionSelection(val);
      }
    });
    this.runtimes.forEach((val) => {
      if (this.runtimeId === val.id) {
        this.updateRuntimeSelection(val);
        this.updateVersionSelection(val, selection.runtimeVersion);
      }
    });
    this.initCompleted();
  }

  private updateMissionSelection(val: Mission): void {
    this.wizardComponent.summary.mission = val;

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
      if (!found) {
        // reset menu selection
        runtime.version = versions[0];

        // Reset wizard summary selection
        if (this.wizardComponent.summary.runtime !== undefined) {
          this.wizardComponent.summary.runtime.version = versions[0];
        }
      }
    });
    this.initCompleted();
  }

  private updateRuntimeSelection(val: Runtime): void {
    this.wizardComponent.summary.runtime = val;

    // Set summary version
    if (val.version !== undefined) {
      this.wizardComponent.summary.runtime.version = val.version;
    }
    this.initCompleted();
  }

  private updateVersionSelection(val: Runtime, version: any): void {
    val.version = version; // Don't update summary, just store selection
  }
}
