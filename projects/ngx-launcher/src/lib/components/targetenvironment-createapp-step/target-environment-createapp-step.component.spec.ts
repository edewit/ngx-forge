import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { Broadcaster } from 'ngx-base';

import { TargetEnvironmentCreateappStepComponent } from './target-environment-createapp-step.component';
import { TargetEnvironment } from '../../model/target-environment.model';
import { TargetEnvironmentService } from '../../service/target-environment.service';
import { TokenService } from '../../service/token.service';
import { LinkAccountsCreateappStepComponent } from '../link-accounts-createapp-step/link-accounts-createapp-step.component';
import { MissionRuntimeService } from '../../service/mission-runtime.service';
import { Catalog } from '../../model/catalog.model';
import { Projectile } from '../../model/projectile.model';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';

export class BroadcasterTestProvider {
  static broadcaster = new Broadcaster();
}

const mockTargetEnvironmentService = {
  getTargetEnvironments(): Observable<TargetEnvironment[]> {
    const targetEnvironments = of( [{
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
};

const mockTokenService: TokenService = {
  clusters: of([]),
  createOathLink: (token) => ''
};
class MockMissionRuntimeService extends MissionRuntimeService {
  getCatalog(): Observable<Catalog> {
    return of();
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
        NoopAnimationsModule
      ],
      declarations: [
        TargetEnvironmentCreateappStepComponent,
        LinkAccountsCreateappStepComponent,
        ButtonNextStepComponent
      ],
      providers: [
        Projectile,
        {
          provide: TargetEnvironmentService, useValue: mockTargetEnvironmentService
        },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster },
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
