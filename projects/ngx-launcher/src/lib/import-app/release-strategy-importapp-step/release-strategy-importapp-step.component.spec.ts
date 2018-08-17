import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { FilterEvent } from 'patternfly-ng/filter';
import { SortArrayPipeModule } from 'patternfly-ng/pipe';
import { SortEvent } from 'patternfly-ng/sort';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { PipelineService } from '../../service/pipeline.service';
import { Pipeline, Stage } from '../../model/pipeline.model';
import { ReleaseStrategyImportappStepComponent } from './release-strategy-importapp-step.component';
import { Selection } from '../../model/selection.model';
import { Summary } from '../../model/summary.model';

// @ts-ignore
@Component({
  selector: 'f8launcher-pfng-toolbar',
  template: ''
})
export class FakePfngToolbarComponent {
  @Input() config: any;
  @Output() onFilterChange = new EventEmitter<FilterEvent>();
  @Output() onSortChange = new EventEmitter<SortEvent>();
}

const mockPipelineService = {
  getPipelines(): Observable<Pipeline[]> {
    const stage = {
      description: 'description...',
      name: 'Stage Name'
    } as Stage;
    const pipelines = of([{
      'id': 'Pipeline1',
      'suggested': true,
      'name': 'Release',
      'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
      'stages': [stage, stage, stage],
      'platform': 'maven'
    } as Pipeline]);
    return pipelines;
  }
};

export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
  currentSelection(): any;
  onInViewportChange($event: any, id: string): any;
}

const mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summary: {
    dependencyCheck: {},
    gitHubDetails: {}
  },
  summaryCompleted: false,
  addStep(step: LauncherStep) {
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
  },
  get currentSelection(): any {
    const summaryVar = new Summary();
    return {
      groupId: (summaryVar.dependencyCheck !== undefined) ? summaryVar.dependencyCheck.groupId : undefined,
      missionId: (summaryVar.mission !== undefined) ? summaryVar.mission.id : undefined,
      pipelineId: (summaryVar.pipeline !== undefined) ? this.summaryVar.pipeline.id : undefined,
      projectName: (summaryVar.dependencyCheck !== undefined)
        ? summaryVar.dependencyCheck.projectName : undefined,
      projectVersion: (summaryVar.dependencyCheck !== undefined)
        ? summaryVar.dependencyCheck.projectVersion : undefined,
      runtimeId: (summaryVar.runtime !== undefined) ? summaryVar.runtime.id : undefined,
      runtimeVersion: (summaryVar.runtime !== undefined) ? summaryVar.runtime.version : undefined,
      platform: (summaryVar.runtime !== undefined) ? summaryVar.runtime.pipelinePlatform : 'maven',
      spacePath: (summaryVar.dependencyCheck !== undefined)
        ? summaryVar.dependencyCheck.spacePath : undefined,
      targetEnvironment: summaryVar.targetEnvironment,
      dependencyCheck: (summaryVar.dependencyCheck !== undefined) ? summaryVar.dependencyCheck : undefined,
      dependencyEditor: (summaryVar.dependencyEditor !== undefined) ? summaryVar.dependencyEditor : undefined
    } as Selection;
  },
  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this.selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }
};

describe('Import ReleaseStrategyStepComponent', () => {
  let component: ReleaseStrategyImportappStepComponent;
  let fixture: ComponentFixture<ReleaseStrategyImportappStepComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
          InViewportModule,
          RouterTestingModule,
          SortArrayPipeModule
        ],
        declarations: [
          ReleaseStrategyImportappStepComponent,
          FakePfngToolbarComponent
        ],
        providers : [
          {
            provide: PipelineService, useValue: mockPipelineService
          },
          {
            provide: LauncherComponent, useValue: mockWizardComponent
          },
          {
            provide: WindowRef, useValue: window
          }
        ]
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseStrategyImportappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
