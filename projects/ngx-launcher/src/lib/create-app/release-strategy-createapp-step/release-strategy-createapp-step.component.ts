import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  ViewEncapsulation } from '@angular/core';

import { PipelineService } from '../../service/pipeline.service';
import { Pipeline } from '../../model/pipeline.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { broadcast } from '../../shared/telemetry.decorator';
import { Broadcaster} from 'ngx-base';
import { Runtime } from '../../model/runtime.model';
import { Subscription } from 'rxjs';
import { Projectile, StepState } from '../../model/summary.model';
import { ReleaseStrategyCreateappReviewComponent } from './release-strategy-createapp-review.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-releasestrategy-createapp-step',
  templateUrl: './release-strategy-createapp-step.component.html',
  styleUrls: ['./release-strategy-createapp-step.component.less']
})
export class ReleaseStrategyCreateappStepComponent extends LauncherStep implements OnInit, OnDestroy {
  private _pipelines: Pipeline[] = [];
  private _allPipelines: Pipeline[] = [];
  public pipeline: Pipeline = new Pipeline();

  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private pipelineService: PipelineService,
              private projectile: Projectile<Pipeline>,
              private broadcaster: Broadcaster) {
    super(launcherComponent, ReleaseStrategyCreateappReviewComponent, projectile);
  }

  ngOnInit() {
    const state = new StepState(this.pipeline, [
      { name: 'pipelineId', value: 'id' }
    ]);
    this.projectile.setState(this.id, state);

    this.launcherComponent.addStep(this);
    this.subscriptions.push(this.pipelineService.getPipelines().subscribe((result: Array<Pipeline>) => {
      this._allPipelines = result;
      this.restore();
    }));
    this.subscriptions.push(this.broadcaster.on<Runtime>('runtime-changed').subscribe(runtime => {
      this.filterPipelines(runtime.pipelinePlatform);
      if (this.pipeline.platform !== runtime.pipelinePlatform) {
        this.updatePipelineSelection(new Pipeline());
      }
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
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    return this.pipeline.id !== undefined;
  }

  // Steps
  @broadcast('completePipelineStep_Create', {
    'pipeline': {
      pipeline: 'name'
    }
  })
  navToNextStep(): void {
    this.launcherComponent.navToNextStep('ReleaseStrategy');
  }

  updatePipelineSelection(pipeline: Pipeline): void {
    Object.assign(this.pipeline, pipeline);
  }

  restoreModel(model: any): void {
    this.updatePipelineSelection(this._allPipelines.find(p => p.id === model.pipelineId));
    this.filterPipelines(this.pipeline.platform);
  }

  toggleExpanded(pipeline: Pipeline) {
    pipeline.expanded = !pipeline.expanded;
  }

  private filterPipelines(selectedPlatform: string) {
    this._pipelines = this._allPipelines.filter(({ platform }) => platform === selectedPlatform);
  }
}
