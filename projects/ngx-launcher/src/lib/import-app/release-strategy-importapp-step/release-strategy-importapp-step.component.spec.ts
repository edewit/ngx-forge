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

import { FilterEvent } from 'patternfly-ng/filter';
import { SortArrayPipeModule } from 'patternfly-ng/pipe';
import { SortEvent } from 'patternfly-ng/sort';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { PipelineService } from '../../service/pipeline.service';
import { Pipeline, Stage } from '../../model/pipeline.model';
import { ReleaseStrategyImportappStepComponent } from './release-strategy-importapp-step.component';

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
};

describe('Import ReleaseStrategyStepComponent', () => {
  let component: ReleaseStrategyImportappStepComponent;
  let fixture: ComponentFixture<ReleaseStrategyImportappStepComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          CommonModule,
          FormsModule,
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
