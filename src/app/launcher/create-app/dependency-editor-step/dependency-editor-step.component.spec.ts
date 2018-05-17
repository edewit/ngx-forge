import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';

import { DependencyEditorModule,  URLProvider, DependencyEditorTokenProvider }
  from 'fabric8-analytics-dependency-editor';
import { DependencyCheck } from '../../launcher.module';
import { DependencyCheckService } from '../../service/dependency-check.service';

import { DependencyEditorService } from '../../service/dependency-editor.service';
import { DependencyEditorCreateappStepComponent } from './dependency-editor-step.component';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Summary } from '../../launcher.module';

import { DemoDependencyEditorService } from '../../../../demo/service/demo-dependency-editor.service';
import { HelperService } from '../../service/helper.service';
import { TokenProvider } from '../../../../app/service/token-provider';

let mockHelperService = {
  getBackendUrl(): string {
    return 'https://backend.url/';
  },
  getOrigin(): string {
    return 'origin';
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

describe('DependencyEditorCreateappStepComponent', () => {
  let component: DependencyEditorCreateappStepComponent;
  let fixture: ComponentFixture<DependencyEditorCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DependencyEditorModule,
        FormsModule,
        RouterTestingModule,
        InViewportModule
      ],
      declarations: [
        DependencyEditorCreateappStepComponent
      ],
      providers : [
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
        {
          provide: WindowRef, useValue: window
        }
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
