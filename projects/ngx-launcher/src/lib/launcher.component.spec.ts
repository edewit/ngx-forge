import {
  Component,
  Input
} from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { CancelOverlayComponent } from './cancel-overlay/cancel-overlay.component';
import { LauncherComponent } from './launcher.component';


import { ActivateBoosterCreateappNextstepComponent }
  from './create-app/activate-booster-createapp-nextstep/activate-booster-createapp-nextstep.component';
import { ProjectProgressCreateappNextstepComponent }
  from './create-app/project-progress-createapp-nextstep/project-progress-createapp-nextstep.component';
import { ProjectProgressImportappNextstepComponent }
  from './import-app/project-progress-importapp-nextstep/project-progress-importapp-nextstep.component';

import { HelperService } from './service/helper.service';
import { TokenProvider } from '../lib/service/token-provider';
import { Subject, Observable } from 'rxjs';
import { Progress } from './model/progress.model';
import { ProjectProgressService } from './service/project-progress.service';
import { Broadcaster } from 'ngx-base';
import { BroadcasterTestProvider } from './create-app/targetenvironment-createapp-step/target-environment-createapp-step.component.spec';
import { DependencyCheckService } from './service/dependency-check.service';
import { DemoDependencyCheckService } from '../../../../src/app/service/demo-dependency-check.service';
import { ProjectSummaryService } from './service/project-summary.service';
import { DemoProjectSummaryService } from '../../../../src/app/service/demo-project-summary.service';
import { DependencyEditorModule } from 'fabric8-analytics-dependency-editor';
import { Projectile } from './model/summary.model';

// @ts-ignore
@Component({
  selector: 'f8launcher-step-indicator',
  template: ''
})
export class Fakef8launcherStepIndicator {
  @Input() inProgress: boolean;
}

@Component({
  selector: 'f8launcher-missionruntime-createapp-step',
  template: ''
})
export class Fakef8launcherMissionruntimeCreateappStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-dependencychecker-createapp-step',
  template: ''
})
export class Fakef8launcherDependencyCheckeerCreatesppStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
  @Input() depEditorFlag = false;
}

@Component({
  selector: 'f8launcher-targetenvironment-createapp-step',
  template: ''
})
export class Fakef8launcherTargetEnvironmentCreateappStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-releasestrategy-createapp-step',
  template: ''
})
export class Fakef8launcherReleaseStrategyCreateappStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-gitprovider-createapp-step',
  template: ''
})
export class Fakef8launcherGitproviderCreateappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-projectsummary-createapp-step',
  template: ''
})
export class Fakef8launcherProjectSummaryCreateappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
  @Input() depEditorFlag: boolean = false;
}

@Component({
  selector: 'f8launcher-releasestrategy-importapp-step',
  template: ''
})
export class Fakef8launcherReleaseStrategyImportappStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
  @Input() optional = false;
}

@Component({
  selector: 'f8launcher-gitprovider-importapp-step',
  template: ''
})
export class Fakef8launcherGitproviderImportappStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-projectsummary-importapp-step',
  template: ''
})
export class Fakef8launcherProjectSummaryImportappStep {
  @Input() id: string;
  @Input() completed = false;
  @Input() hidden = false;
  @Input() styleClass: string;
  @Input() title: string;
}

const mockHelperService = {
  getBackendUrl(): string {
    return 'https://backend.url/';
  },
  getOrigin(): string {
    return 'origin';
  }
};

const progressSubject: Subject<Progress[]> = new Subject();
const mockProjectProgressService = {
  getProgress(): Observable<Progress[]> {
    return progressSubject.asObservable();
  }
};

describe('LauncherComponent', () => {
  let component: LauncherComponent;
  let fixture: ComponentFixture<LauncherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DependencyEditorModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        ActivateBoosterCreateappNextstepComponent,
        CancelOverlayComponent,
        Fakef8launcherDependencyCheckeerCreatesppStep,
        Fakef8launcherGitproviderCreateappStep,
        Fakef8launcherGitproviderImportappStep,
        Fakef8launcherMissionruntimeCreateappStep,
        Fakef8launcherProjectSummaryCreateappStep,
        Fakef8launcherProjectSummaryImportappStep,
        Fakef8launcherReleaseStrategyCreateappStep,
        Fakef8launcherReleaseStrategyImportappStep,
        Fakef8launcherTargetEnvironmentCreateappStep,
        Fakef8launcherStepIndicator,
        LauncherComponent,
        ProjectProgressCreateappNextstepComponent,
        ProjectProgressImportappNextstepComponent
      ],
      providers: [
        Projectile,
        TokenProvider,
        { provide: DependencyCheckService, useClass: DemoDependencyCheckService },
        { provide: HelperService, useValue: mockHelperService },
        { provide: ProjectProgressService, useValue: mockProjectProgressService },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
        { provide: ProjectSummaryService, useClass: DemoProjectSummaryService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LauncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
