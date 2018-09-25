import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  Component,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { DependencyCheck } from '../../launcher.module';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryImportappStepComponent } from './project-summary-importapp-step.component';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Projectile } from '../../launcher.module';
import { Broadcaster } from 'ngx-base';
import { BroadcasterTestProvider } from '../../create-app/targetenvironment-createapp-step/target-environment-createapp-step.component.spec';
import { ReviewDirective } from '../../create-app/project-summary-createapp-step/review.directive';

@Component({
  selector: 'fab-toast-notification',
  template: ''
})
export class FakeToastNotificationComponent {
  @Input() notifications: any;
}

const mockProjectSummaryService = {
  setup(summary: Projectile<any>): Observable<boolean> {
    return of(true);
  },
  verify(summary: Projectile<any>): Observable<boolean> {
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
  steps: LauncherStep[];
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
}

const mockWizardComponent: TypeWizardComponent = {
  steps: [],
  summaryCompleted: false,
  addStep(step: LauncherStep) {
    this.steps.push(step);
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
        RouterTestingModule
      ],
      declarations: [
        ReviewDirective,
        ProjectSummaryImportappStepComponent,
        FakeToastNotificationComponent
      ],
      providers : [
        Projectile,
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
        {
          provide: ProjectSummaryService, useValue: mockProjectSummaryService
        },
        {
          provide: DependencyCheckService, useValue: mockDependencyCheckService
        },
        {
          provide: LauncherComponent, useValue: mockWizardComponent
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
