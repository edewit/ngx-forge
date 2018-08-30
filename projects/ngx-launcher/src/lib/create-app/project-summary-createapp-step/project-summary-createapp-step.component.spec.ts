import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  Component,
  Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { DependencyCheck } from '../../launcher.module';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryCreateappStepComponent } from './project-summary-createapp-step.component';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Broadcaster } from 'ngx-base';
import { BroadcasterTestProvider } from '../targetenvironment-createapp-step/target-environment-createapp-step.component.spec';

@Component({
  selector: 'fab-toast-notification',
  template: ''
})
export class FakeToastNotificationComponent {
  @Input() notifications: any;
}

const mockProjectSummaryService = {
  setup(): Observable<boolean> {
    return of(true);
  },
  verify(): Observable<boolean> {
    return of(true);
  },
  getCurrentContext(): Observable<any> {
    return of({});
  }
};

const mockDependencyCheckService = {
  getDependencyCheck(): Observable<DependencyCheck> {
    return of({
      mavenArtifact: 'd4-345',
      groupId: 'io.openshift.booster',
      projectName: 'App_test_1',
      projectVersion: '1.0.0-SNAPSHOT',
      spacePath: '/myspace'
    });
  }
};

export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
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
  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this.selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }
};

describe('ProjectSummaryStepComponent', () => {
  let component: ProjectSummaryCreateappStepComponent;
  let fixture: ComponentFixture<ProjectSummaryCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        InViewportModule
      ],
      declarations: [
        ProjectSummaryCreateappStepComponent,
        FakeToastNotificationComponent
      ],
      providers : [
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
        {
          provide: ProjectSummaryService, useValue: mockProjectSummaryService
        },
        {
          provide: DependencyCheckService, useValue: mockDependencyCheckService
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
    fixture = TestBed.createComponent(ProjectSummaryCreateappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
