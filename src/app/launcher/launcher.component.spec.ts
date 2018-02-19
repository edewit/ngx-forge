import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { CancelOverlayComponent } from './cancel-overlay/cancel-overlay.component';
import { LauncherComponent } from './launcher.component';
import { LauncherStep } from './launcher-step';
import { Selection } from './model/selection.model';
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';
import { Summary } from './model/summary.model';

import { ActivateBoosterCreateappNextstepComponent }
  from './create-app/activate-booster-createapp-nextstep/activate-booster-createapp-nextstep.component';
import { ProjectProgressCreateappNextstepComponent }
  from './create-app/project-progress-createapp-nextstep/project-progress-createapp-nextstep.component';
import { ProjectProgressImportappNextstepComponent }
  from './import-app/project-progress-importapp-nextstep/project-progress-importapp-nextstep.component';

import { from } from 'rxjs/observable/from';

@Component({
  selector: 'f8launcher-step-indicator',
  template: ''
})
export class Fakef8launcherStepIndicator {
  @Input() inProgress: boolean 
}

@Component({
  selector: 'f8launcher-missionruntime-createapp-step',
  template: ''
})
export class Fakef8launcherMissionruntimeCreateappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-targetenvironment-createapp-step',
  template: ''
})
export class Fakef8launcherTargetEnvironmentCreateappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-releasestrategy-createapp-step',
  template: ''
})
export class Fakef8launcherReleaseStrategyCreateappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
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
}

@Component({
  selector: 'f8launcher-releasestrategy-importapp-step',
  template: ''
})
export class Fakef8launcherReleaseStrategyImportappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-gitprovider-importapp-step',
  template: ''
})
export class Fakef8launcherGitproviderImportappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
}

@Component({
  selector: 'f8launcher-projectsummary-importapp-step',
  template: ''
})
export class Fakef8launcherProjectSummaryImportappStep {
  @Input() id: string;
  @Input() completed: boolean = false;
  @Input() hidden: boolean = false;
  @Input() styleClass: string;
  @Input() title: string;
}

describe('LauncherComponent', () => {
  let component: LauncherComponent;
  let fixture: ComponentFixture<LauncherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        ActivateBoosterCreateappNextstepComponent,
        CancelOverlayComponent,
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
