import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PipelineService } from '../service/pipeline.service';
import { Pipeline } from '../model/pipeline.model';
import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-releasestrategy-step',
  templateUrl: './release-strategy-step.component.html',
  styleUrls: ['./release-strategy-step.component.less']
})
export class ReleaseStrategyStepComponent implements OnInit, OnDestroy {
  @Input() id: string;

  public pipelines: Pipeline[];
  private _pipelineId: string;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private pipelineService: PipelineService) {
  }

  ngOnInit() {
    let pipelineSubscription = this.pipelineService.getPipelines().subscribe((result) => {
      this.pipelines = result;
    });
    this.subscriptions.push(pipelineSubscription);
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
    return (this.wizardComponent.summary.pipeline !== undefined);
  }

  /**
   * Returns pipeline ID
   *
   * @returns {string} The pipeline ID
   */
  get pipelineId(): string {
    return this._pipelineId;
  }

  /**
   * Set the pipeline ID
   *
   * @param {string} val The pipeline ID
   */
  set pipelineId(val: string) {
    this._pipelineId = val;
  }

  // Steps

  navToNextStep(): void {
    this.wizardComponent.stepIndicator.getStep(this.id).completed = this.stepCompleted;
    this.wizardComponent.navToNextStep();
  }

  updatePipelineSelection(pipeline: Pipeline): void {
    this.wizardComponent.summary.pipeline = pipeline;
  }

  // Private

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.pipelineId = selection.pipelineId;
  }
}
