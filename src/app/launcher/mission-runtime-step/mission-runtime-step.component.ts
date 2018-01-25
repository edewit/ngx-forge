import { Component, Host, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MissionRuntimeService } from '../service/mission-runtime.service';
import { WizardComponent } from '../wizard.component';

import { Mission } from '../model/mission.model';
import { Runtime } from '../model/runtime.model';
import { Selection } from '../model/selection.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-missionruntime-step',
  templateUrl: './mission-runtime-step.component.html',
  styleUrls: ['./mission-runtime-step.component.less']
})
export class MissionRuntimeStepComponent implements OnInit, OnDestroy {
  public missions: Mission[];
  public runtimes: Runtime[];

  private missionId: string;
  private runtimeId: string;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private missionRuntimeService: MissionRuntimeService) {
  }

  ngOnInit() {
    let missionSubscription = this.missionRuntimeService.getMissions().subscribe((result) => {
      this.missions = result;
    });
    let runtimeSubscription = this.missionRuntimeService.getRuntimes().subscribe((result) => {
      this.runtimes = result;
    });
    this.subscriptions.push(missionSubscription);
    this.subscriptions.push(runtimeSubscription);

    this.restoreSummary();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.missionId = selection.missionId;
    this.runtimeId = selection.runtimeId;

    this.missions.forEach((val) => {
      if (this.missionId === val.missionId) {
        this.updateMissionSelection(val);
      }
    });
    this.runtimes.forEach((val) => {
      if (this.runtimeId === val.runtimeId) {
        this.updateRuntimeSelection(val);
        this.updateVersionSelection(val, selection.runtimeVersion);
      }
    });
  }

  private updateMissionSelection(val: Mission): void {
    this.wizardComponent.summary.mission = val;
  }

  private updateRuntimeSelection(val: Runtime): void {
    this.wizardComponent.summary.runtime = val;
  }

  private updateVersionSelection(val: Runtime, version: string): void {
    this.wizardComponent.summary.runtime = val;
    this.wizardComponent.summary.runtime.version = version;
  }
}
