import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DependencyEditorModule } from 'fabric8-analytics-dependency-editor';
import { Broadcaster } from 'ngx-base';
import { Observable, of } from 'rxjs';

import { DemoDependencyEditorService } from '../../../../../../src/app/service/demo-dependency-editor.service';
import { TokenProvider } from '../../../lib/service/token-provider';
import { DependencyCheck } from '../../launcher.module';
import { Projectile, StepState } from '../../model/projectile.model';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { DependencyEditorService } from '../../service/dependency-editor.service';
import { HelperService } from '../../service/helper.service';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';
import { BroadcasterTestProvider } from '../targetenvironment-step/target-environment-step.component.spec';
import { DependencyEditorStepComponent } from './dependency-editor-step.component';

const mockHelperService = {
  getBackendUrl(): string {
    return 'https://backend.url/';
  },
  getOrigin(): string {
    return 'origin';
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

describe('DependencyEditorCreateappStepComponent', () => {
  let component: DependencyEditorStepComponent;
  let fixture: ComponentFixture<DependencyEditorStepComponent>;

  beforeEach(async(() => {
    const projectile = new Projectile<any>();
    projectile.setState('MissionRuntime', new StepState({}, []));
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DependencyEditorModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        DependencyEditorStepComponent,
        ButtonNextStepComponent
      ],
      providers : [
        { provide: Projectile, useValue: projectile },
        TokenProvider,
        {
          provide: DependencyCheckService, useValue: mockDependencyCheckService
        },
        {
          provide: DependencyEditorService, useClass: DemoDependencyEditorService
        },
        { provide: HelperService, useValue: mockHelperService },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyEditorStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
