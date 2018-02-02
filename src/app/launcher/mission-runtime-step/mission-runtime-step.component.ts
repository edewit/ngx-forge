import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
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
  public missions: Mission[];
  public runtimes: Runtime[];

  private missionId: string;
  private runtimeId: string;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private missionRuntimeService: MissionRuntimeService) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
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

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.wizardComponent.summary.mission !== undefined
      && this.wizardComponent.summary.runtime !== undefined
      && this.wizardComponent.summary.runtime !== undefined
      && this.wizardComponent.summary.runtime.version !== undefined);
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
    this.wizardComponent.navToNextStep();
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
    this.wizardComponent.summary.runtime.version = (val.version !== undefined) ? val.version : val.versions[0];
  }

  private updateVersionSelection(val: Runtime, version: string): void {
    val.version = version; // Don't update summary, just store selection
  }
}
