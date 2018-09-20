import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  Filter,
  FilterConfig,
  FilterField,
  FilterEvent,
  FilterType
} from 'patternfly-ng/filter';

import {
  SortConfig,
  SortField,
  SortEvent
} from 'patternfly-ng/sort';

import { ToolbarConfig } from 'patternfly-ng/toolbar';

import { PipelineService } from '../../service/pipeline.service';
import { Pipeline } from '../../model/pipeline.model';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { broadcast } from '../../shared/telemetry.decorator';
import { Projectile } from '../../model/summary.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-releasestrategy-importapp-step',
  templateUrl: './release-strategy-importapp-step.component.html',
  styleUrls: ['./release-strategy-importapp-step.component.less']
})
export class ReleaseStrategyImportappStepComponent extends LauncherStep implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() optional = false;

  toolbarConfig: ToolbarConfig;

  private allPipelines: Pipeline[];
  private filterConfig: FilterConfig;
  private isAscendingSort = true;
  private _pipelines: Pipeline[];
  private _pipelineId: string;
  private sortConfig: SortConfig;
  private currentSortField: SortField;

  private subscriptions: Subscription[] = [];
  pipeline: Pipeline;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private projectile: Projectile<any>,
              private pipelineService: PipelineService) {
    super(launcherComponent, null, projectile);
  }

  ngOnInit() {
    this.filterConfig = {
      fields: [{
        id: 'name',
        title: 'Name',
        placeholder: 'Filter by Name...',
        type: FilterType.TEXT
      }] as FilterField[],
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'name',
        title: 'Name',
        sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.toolbarConfig = {
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig
    } as ToolbarConfig;

    this.launcherComponent.addStep(this);

    this.subscriptions.push(this.pipelineService.getPipelines().subscribe((result: Array<Pipeline>) => {
      this._pipelines = result;
      this.restore();
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
  get completed(): boolean {
    return (this.pipeline !== undefined);
  }

  // Filter

  applyFilters(filters: Filter[]): void {
    this._pipelines = [];
    if (filters && filters.length > 0) {
      this.allPipelines.forEach((pipeline) => {
        if (this.matchesFilters(pipeline, filters)) {
          this._pipelines.push(pipeline);
        }
      });
    } else {
      this._pipelines = this.allPipelines;
    }
  }

  // Handle filter changes
  filterChanged($event: FilterEvent): void {
    this.applyFilters($event.appliedFilters);
  }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === 'name') {
      match = item.name.match(filter.value) !== null;
    }
    return match;
  }

  matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;
    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return matches;
      }
    });
    return matches;
  }

  // Sort

  compare(item1: any, item2: any): number {
    let compValue = 0;
    if (this.currentSortField.id === 'name') {
      compValue = item1.name.localeCompare(item2.name);
    }
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  // Handle sort changes
  sortChanged($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this._pipelines.sort((item1: any, item2: any) => this.compare(item1, item2));
  }

  // Steps
  @broadcast('completePipelineStep_Import', {
    'launcherComponent.summary.pipeline': {
      pipeline: 'name'
    }
  })
  navToNextStep(): void {
    this.launcherComponent.navToNextStep('ReleaseStrategy');
  }

  updatePipelineSelection(pipeline: Pipeline): void {
    this.pipeline = pipeline;
  }

  // Private

  restoreModel(model: any): void {
    this.pipeline = this.pipelines.find(p => p.id === model.pipelineId);
  }

  saveModel(): any {
    return { pipelineId: this.pipeline.id };
  }

  toggleExpanded(pipeline: Pipeline) {
    pipeline.expanded = (pipeline.expanded !== undefined) ? !pipeline.expanded : false;
  }
}
