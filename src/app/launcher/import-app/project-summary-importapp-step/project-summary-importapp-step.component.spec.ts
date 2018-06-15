import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { DependencyCheck } from '../../launcher.module';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryImportappStepComponent } from './project-summary-importapp-step.component';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Summary } from '../../launcher.module';

@Component({
  selector: 'fab-toast-notification',
  template: ''
})
export class FakeToastNotificationComponent {
  @Input() notifications: any 
}

let mockProjectSummaryService = {
  setup(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  },
  verify(summary: Summary): Observable<boolean> {
    return Observable.of(true);
  },
  getCurrentContext(): Observable<any> {
    return Observable.of({});
  }
};

let mockDependencyCheckService = {
  getDependencyCheck(): Observable<DependencyCheck> {
    return Observable.of({
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
  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this.selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }
};

describe('Import ProjectSummaryStepComponent', () => {
  let component: ProjectSummaryImportappStepComponent;
  let fixture: ComponentFixture<ProjectSummaryImportappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        InViewportModule
      ],
      declarations: [
        ProjectSummaryImportappStepComponent,
        FakeToastNotificationComponent
      ],
      providers : [
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
    fixture = TestBed.createComponent(ProjectSummaryImportappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
