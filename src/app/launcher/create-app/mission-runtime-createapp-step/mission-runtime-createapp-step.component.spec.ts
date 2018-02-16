import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { MissionRuntimeCreateappStepComponent } from './mission-runtime-createapp-step.component';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { Mission } from '../../model/mission.model';
import { Runtime } from '../../model/runtime.model';

let mockMissionRuntimeService = {
  getMissions(): Observable<Mission[]> {
    let missions = Observable.of( [{
      id: 'crud',
      name: 'CRUD',
      suggested: false,
      description : 'sample desp',
      runtimes: [
      'vert.x',
      'nodejs',
      'spring-boot',
      'wildfly-swarm'
      ]
      }]);
      return missions;
  },
  getRuntimes(): Observable<Runtime[]>{
    let runtimes = Observable.of( [<Runtime>{
      'id': 'vert.x',
      'name': 'Eclipse Vert.x',
      'description': 'Brief description of the technology...',
      /* stylelint-disable */
      'icon': "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 280'%3E%3Cpath fill='%23022B37' d='M107 170.8L67.7 72H46.9L100 204h13.9L167 72h-20.4zm64 33.2h80v-20h-61v-37h60v-19h-60V91h61V72h-80zm180.1-90.7c0-21-14.4-42.3-43.1-42.3h-48v133h19V91h29.1c16.1 0 24 11.1 24 22.4 0 11.5-7.9 22.6-24 22.6H286v9.6l48 58.4h24.7L317 154c22.6-4 34.1-22 34.1-40.7m56.4 90.7v-1c0-6 1.7-11.7 4.5-16.6V91h39V71h-99v20h41v113h14.5z'/%3E%3Cpath fill='%23623C94' d='M458 203c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18M577.4 72h-23.2l-27.5 37.8L499.1 72h-40.4c12.1 16 33.6 46.8 47.8 66.3l-37 50.9c2 4.2 3.1 8.9 3.1 13.8v1H499l95.2-132h-16.8zm-19.7 81.5l-20.1 27.9 16.5 22.6h40.2c-9.6-13.7-24-33.3-36.6-50.5z'/%3E%3C/svg%3E",
      /* stylelint-enable */
      'projectVersion': 'v1.0.0',
      'missions': [
        {
          'id': 'crud',
          'versions': [
            {
              'id': 'community',
              'name': '3.5.0.Final (Community)'
            }
          ]
        }],
      'url': 'https://github.com/fabric8-launcher/ngx-launcher'
    }]);
    return runtimes;
  }
}

export interface TypeWizardComponent {
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

describe('MissionRuntimeStepComponent', () => {
  let component: MissionRuntimeCreateappStepComponent;
  let fixture: ComponentFixture<MissionRuntimeCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        InViewportModule
      ],
      declarations: [
        MissionRuntimeCreateappStepComponent
      ],
      providers: [
        {
          provide: MissionRuntimeService, useValue: mockMissionRuntimeService
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
    fixture = TestBed.createComponent(MissionRuntimeCreateappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
