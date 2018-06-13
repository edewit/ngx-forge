import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { FilterEvent } from 'patternfly-ng/filter';
import { PipeModule } from 'patternfly-ng/pipe';
import { SortEvent } from 'patternfly-ng/sort';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { PipelineService } from '../../service/pipeline.service';
import { Pipeline } from '../../model/pipeline.model';
import { ReleaseStrategyCreateappStepComponent } from './release-strategy-createapp-step.component';
import { Selection } from '../../model/selection.model';
import { Summary } from '../../model/summary.model';

@Component({
  selector: 'pfng-toolbar',
  template: ''
})
export class FakePfngToolbarComponent {
  @Input() config: any;
  @Output() onFilterChange = new EventEmitter<FilterEvent>();
  @Output() onSortChange = new EventEmitter<SortEvent>();
}

let mockPipelineService = {
  getPipelines(): Observable<Pipeline[]> {
    let pipelines = Observable.of([<Pipeline>{
        'id': 'Pipeline1',
        'suggested': true,
        'name': 'Release',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': [{
          name: 'Stage Name',
          description: 'description...'
        }, {
          name: 'Stage Name',
          description: 'description...'
        }, {
          name: 'Stage Name',
          description: 'description...'
        }],
        'platform': 'maven'
      }]);
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

let mockWizardComponent: TypeWizardComponent = {
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
    let summaryVar = new Summary();
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

describe('ReleaseStrategyStepComponent', () => {
  let component: ReleaseStrategyCreateappStepComponent;
  let fixture: ComponentFixture<ReleaseStrategyCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        PipeModule,
        InViewportModule,
        RouterTestingModule
      ],
      declarations: [
        ReleaseStrategyCreateappStepComponent,
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
    fixture = TestBed.createComponent(ReleaseStrategyCreateappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
