import {
  Component,
  Host,
  ViewChild,
  OnInit
} from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { LauncherComponent } from './launcher.component';

import { DependencyEditorModule } from 'fabric8-analytics-dependency-editor';
import { Projectile } from './model/projectile.model';
import { CancelOverlayComponent } from './cancel-overlay/cancel-overlay.component';
import { LauncherStep } from './launcher-step';
import {
  ActivateBoosterCreateappNextstepComponent
} from './components/activate-booster-createapp-nextstep/activate-booster-createapp-nextstep.component';
import {
  ProjectProgressCreateappNextstepComponent
} from './components/project-progress-createapp-nextstep/project-progress-createapp-nextstep.component';
import { Broadcaster } from 'ngx-base';
import { BroadcasterTestProvider } from './components/targetenvironment-createapp-step/target-environment-createapp-step.component.spec';

@Component({
  template: `
  <f8launcher #launcher>
    <f8launcher-fake-step></f8launcher-fake-step>
  </f8launcher>
  `
})
export class ParentComponent {
  @ViewChild('launcher') launcherComponent: LauncherComponent;
}

@Component({
  selector: 'f8launcher-fake-step',
  template: ''
})
export class Fakef8StepComponent extends LauncherStep implements OnInit {
  completed: boolean;
  constructor(@Host() private launcherComponent: LauncherComponent, projectile: Projectile<any>) {
    super(projectile);
  }
  ngOnInit(): void {
    this.launcherComponent.addStep(this);
  }
  restoreModel(model: any): void {
  }
}

describe('LauncherComponent', () => {
  let component: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        DependencyEditorModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        CancelOverlayComponent,
        ActivateBoosterCreateappNextstepComponent,
        ProjectProgressCreateappNextstepComponent,
        Fakef8StepComponent,
        LauncherComponent,
        ParentComponent
      ],
      providers: [
        Projectile,
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.launcherComponent).toBeTruthy();
  });
});
