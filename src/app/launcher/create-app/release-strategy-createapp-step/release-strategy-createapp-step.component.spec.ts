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

import {
  FilterEvent,
  SortEvent
} from 'patternfly-ng';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { PipelineService } from '../../service/pipeline.service';
import { Pipeline } from '../../model/pipeline.model';
import { ReleaseStrategyCreateappStepComponent } from './release-strategy-createapp-step.component';

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
  getPipelines(): Observable<Pipeline[]>{
    let pipelines = Observable.of([<Pipeline>{
        'id': 'Pipeline1',
        'suggested': true,
        'name': 'Release',
        'description': 'A slightly longer description of this pipeline\'s capabilities and usage.',
        'stages': ['Stage Name', 'Stage Name', 'Stage Name']
      }]);
      return pipelines;
  }
}

export interface TypeWizardComponent{
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
}

let mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summary: {
    dependencyCheck: {},
    gitHubDetails: {}
  },
  summaryCompleted: false,
  addStep(step: LauncherStep){
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
  }
}

describe('ReleaseStrategyStepComponent', () => {
  let component: ReleaseStrategyCreateappStepComponent;
  let fixture: ComponentFixture<ReleaseStrategyCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        InViewportModule
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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
