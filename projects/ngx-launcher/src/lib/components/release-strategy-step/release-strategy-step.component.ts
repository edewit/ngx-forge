import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Observable } from 'rxjs';
import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { Pipeline } from '../../model/pipeline.model';
import { Projectile, StepState } from '../../model/projectile.model';
import { Runtime } from '../../model/runtime.model';
import { PipelineService } from '../../service/pipeline.service';
import { tap, map, switchMap, startWith } from 'rxjs/operators';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-releasestrategy-step',
  templateUrl: './release-strategy-step.component.html',
  styleUrls: ['./release-strategy-step.component.less']
})
export class ReleaseStrategyStepComponent extends LauncherStep implements OnInit, OnDestroy {
  private _pipelines: Observable<Pipeline[]>;
  private _allPipelines: Pipeline[] = [];
  public pipeline: Pipeline = new Pipeline();

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
              private pipelineService: PipelineService,
              private projectile: Projectile<Pipeline>,
              private broadcaster: Broadcaster) {
    super(projectile);
  }

  ngOnInit() {
    const state = new StepState(this.pipeline, [
      { name: 'pipeline', value: 'id' }
    ]);
    this.projectile.setState(this.id, state);

    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }
    this._pipelines = this.broadcaster.on<Runtime>('runtime-changed').pipe(
      tap(runtime => {
        if (this.pipeline.platform !== runtime.pipelinePlatform) {
          this.pipeline.id = undefined;
        }
        return runtime;
      }),
      switchMap(runtime => {
        return this.pipelineService.getPipelines(runtime.pipelinePlatform).pipe(
          map(result => {
            this._allPipelines = result;
            this.restore(this._allPipelines);
            return this.filterPipelines(runtime.pipelinePlatform);
          })
        )
      }),
      startWith([])
    );

  }

  // Accessors

  /**
   * Returns a list of pipelines to display
   *
   * @returns {Pipeline[]} The list of pipelines
   */
  get pipelines(): Observable<Pipeline[]> {
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

  updatePipelineSelection(pipeline: Pipeline): void {
    Object.assign(this.pipeline, pipeline);
  }

  toggleExpanded(pipeline: Pipeline) {
    pipeline.expanded = !pipeline.expanded;
  }

  private filterPipelines(selectedPlatform: string) {
    return this._allPipelines
      .filter(({ platform }) => selectedPlatform ? platform === selectedPlatform : platform === 'maven');
  }
}
