import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { PipelineService } from '../../service/pipeline.service';
import { Pipeline } from '../../model/pipeline.model';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-releasestrategy-createapp-step',
  templateUrl: './release-strategy-createapp-step.component.html',
  styleUrls: ['./release-strategy-createapp-step.component.less']
})
export class ReleaseStrategyCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy {
  @Input() id: string;

  private _pipelines: Pipeline[];
  private _pipelineId: string;

  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private pipelineService: PipelineService) {
    super();
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);
    let filterByRuntime: string = 'maven';
    if (this.launcherComponent && this.launcherComponent.summary && this.launcherComponent.summary.runtime) {
      filterByRuntime = this.launcherComponent.summary.runtime.pipelinePlatform;
    }
    this.subscriptions.push(this.pipelineService.getPipelines(filterByRuntime).subscribe((result: Array<Pipeline>) => {
      this._pipelines = result;
      this.restoreSummary();
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Accessors

  /**
   * Returns a list of pipelines to display
   *
   * @returns {Pipeline[]} The list of pipelines
   */
  get pipelines(): Pipeline[] {
    return this._pipelines;
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

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.launcherComponent.summary.pipeline !== undefined);
  }

  // Steps

  navToNextStep(): void {
    this.launcherComponent.navToNextStep();
  }

  updatePipelineSelection(pipeline: Pipeline): void {
    this.launcherComponent.summary.pipeline = pipeline;
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
    this.pipelineId = selection.pipelineId;
    for (let i = 0; i < this.pipelines.length; i++) {
      if (this.pipelineId === this.pipelines[i].id) {
        this.launcherComponent.summary.pipeline = this.pipelines[i];
      }
    }
    this.initCompleted();
  }

  private toggleExpanded(pipeline: Pipeline) {
    pipeline.expanded = (pipeline.expanded !== undefined) ? !pipeline.expanded : true;
  }
}
