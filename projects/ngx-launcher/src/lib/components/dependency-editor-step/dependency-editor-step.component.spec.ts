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
import { DependencyEditorCreateappStepComponent } from './dependency-editor-step.component';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { HelperService } from '../../service/helper.service';
import { TokenProvider } from '../../../lib/service/token-provider';
import { BroadcasterTestProvider } from '../targetenvironment-createapp-step/target-environment-createapp-step.component.spec';
import { DemoDependencyEditorService } from '../../../../../../src/app/service/demo-dependency-editor.service';
import { Projectile, StepState } from '../../model/summary.model';

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
    for (let i = 0; i < this.steps.length; i++) {
      if (step.id === this.steps[i].id) {
        return;
      }
    }
    this.steps.push(step);
  }
};

describe('DependencyEditorCreateappStepComponent', () => {
  let component: DependencyEditorCreateappStepComponent;
  let fixture: ComponentFixture<DependencyEditorCreateappStepComponent>;

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
        DependencyEditorCreateappStepComponent
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
        {
          provide: LauncherComponent, useValue: mockWizardComponent
        },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyEditorCreateappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
