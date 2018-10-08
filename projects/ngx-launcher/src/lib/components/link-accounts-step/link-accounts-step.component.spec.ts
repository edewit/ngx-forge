import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { LinkAccountsStepComponent } from './link-accounts-step.component';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { TokenService } from '../../launcher.module';
import { of } from 'rxjs';

export interface TypeWizardComponent {
  selectedSection: string;
  steps: LauncherStep[];
  summary: any;
  summaryCompleted: boolean;
  addStep(step: LauncherStep): void;
}

const mockWizardComponent: TypeWizardComponent = {
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
  }
};

const mockTokenService: TokenService = {
  clusters: of([]),
  createOathLink: (token) => ''
};

describe('ActivateBoosterComponent', () => {
  let component: LinkAccountsStepComponent;
  let fixture: ComponentFixture<LinkAccountsStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      declarations: [
        LinkAccountsStepComponent
      ],
      providers: [
        { provide: LauncherComponent, useValue: mockWizardComponent },
        { provide: TokenService, useValue: mockTokenService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAccountsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
