import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { Broadcaster } from 'ngx-base';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { TargetEnvironmentCreateappStepComponent } from './target-environment-createapp-step.component';
import { TargetEnvironment } from '../../model/target-environment.model';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { TokenService } from '../../service/token.service';
import { ModalModule } from 'ngx-modal';
import { LinkAccountsCreateappStepComponent }
  from '../link-accounts-createapp-step/link-accounts-createapp-step.component';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { Catalog } from '../../model/catalog.model';

export class BroadcasterTestProvider {
  static broadcaster = new Broadcaster();
}

let mockTargetEnvironmentService = {
  getTargetEnvironments(): Observable<TargetEnvironment[]> {
    let targetEnvironments = Observable.of( [{
      /* tslint:disable */
      description: 'Here is a brief description of what OpenShift Online is. ' +
                   'There is a distinction between what OpenShift Online does compared to OpenShift.io.',
      benefits: [
        'A repository is created in GitHub containing your new application’s code.',
        'Edit the code locally using the tool of your choice.',
        'Use OpenShift Online to build and deploy your code automatically on each push to your repository’s master branch.'
      ],
      footer: 'OpenShift',
      header: 'Code Locally, Build & Deploy Online',
      /* tslint:disable */
      icon: 'data:image',
      id: 'os',
      styleClass: 'card-pf-footer--logo-os'
      /* tslint:enable */
      }]);
      return targetEnvironments;
  }
}

export interface TypeWizardComponent{
  selectedSection: string,
  steps: LauncherStep[],
  summary: any,
  summaryCompleted: boolean,
  addStep(step: LauncherStep): void
  onInViewportChange($event: any, id: string): any;
};

let mockWizardComponent: TypeWizardComponent = {
  selectedSection: '',
  steps: [],
  summary: {
    dependencyCheck: {},
    gitHubDetails: {}
  },
  summaryCompleted:false,
  addStep(step: LauncherStep){
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
}

let mockTokenService: TokenService = {
  clusters: Observable.of([]),
  createOathLink: (token) => ''
}
class MockMissionRuntimeService extends MissionRuntimeService {
  getCatalog(): Observable<Catalog> {
    return Observable.of();
  }
}





describe('TargetEnvironmentStepComponent', () => {
  let component: TargetEnvironmentCreateappStepComponent;
  let fixture: ComponentFixture<TargetEnvironmentCreateappStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule,
        InViewportModule,
        ModalModule,
        NoopAnimationsModule
      ],
      declarations: [
        TargetEnvironmentCreateappStepComponent,
        LinkAccountsCreateappStepComponent
      ],
      providers: [
        {
          provide: TargetEnvironmentService, useValue: mockTargetEnvironmentService
        },
        {
          provide: LauncherComponent, useValue: mockWizardComponent
        },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
        {
          provide: WindowRef, useValue: window
        },
        {
          provide: MissionRuntimeService, useClass: MockMissionRuntimeService
        },
        { provide: TokenService, useValue: mockTokenService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetEnvironmentCreateappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
