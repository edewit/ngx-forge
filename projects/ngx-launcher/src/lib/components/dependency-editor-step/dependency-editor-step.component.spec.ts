import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of} from 'rxjs';
import { DependencyEditorModule,  URLProvider, DependencyEditorTokenProvider } from 'fabric8-analytics-dependency-editor';
import { Broadcaster } from 'ngx-base';

import { DependencyCheck } from '../../launcher.module';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { DependencyEditorService } from '../../service/dependency-editor.service';
import { DependencyEditorStepComponent } from './dependency-editor-step.component';
import { HelperService } from '../../service/helper.service';
import { TokenProvider } from '../../../lib/service/token-provider';
import { BroadcasterTestProvider } from '../targetenvironment-step/target-environment-step.component.spec';
import { DemoDependencyEditorService } from '../../../../../../src/app/service/demo-dependency-editor.service';
import { Projectile, StepState } from '../../model/projectile.model';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';

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
