import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { ActivateBoosterNextstepComponent } from './activate-booster-nextstep.component';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { Projectile, StepState } from '../../model/projectile.model';
import { TargetEnvironmentSelection } from '../../model/target-environment.model';

export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
}

const mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summaryCompleted: false,
  addStep(step: LauncherStep) {
    this.steps.push(step);
  }
};

describe('ActivateBoosterComponent', () => {
  let component: ActivateBoosterNextstepComponent;
  let fixture: ComponentFixture<ActivateBoosterNextstepComponent>;

  beforeEach(async(() => {
    const projectile = new Projectile<any>();
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule
      ],
      declarations: [
        ActivateBoosterNextstepComponent
      ],
      providers: [
        { provide: Projectile, useValue: projectile },
        { provide: LauncherComponent, useValue: mockWizardComponent }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateBoosterNextstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
