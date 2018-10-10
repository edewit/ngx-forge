import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import {
  Component,
  Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { DependencyCheck } from '../../model/dependency-check.model';
import { Projectile } from '../../model/projectile.model';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';
import { BroadcasterTestProvider } from '../targetenvironment-step/target-environment-step.component.spec';
import { ProjectSummaryStepComponent } from './project-summary-step.component';

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
      spacePath: '/myspace',
      targetEnvironment: undefined
    });
  }
};

describe('ProjectSummaryStepComponent', () => {
  let component: ProjectSummaryStepComponent;
  let fixture: ComponentFixture<ProjectSummaryStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        ProjectSummaryStepComponent,
        FakeToastNotificationComponent,
        ButtonNextStepComponent
      ],
      providers : [
        Projectile,
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
        {
          provide: ProjectSummaryService, useValue: mockProjectSummaryService
        },
        {
          provide: DependencyCheckService, useValue: mockDependencyCheckService
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSummaryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
