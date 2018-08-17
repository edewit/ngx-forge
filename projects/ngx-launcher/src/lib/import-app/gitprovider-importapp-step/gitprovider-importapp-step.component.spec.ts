import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { DependencyCheck } from '../../launcher.module';
import { DependencyCheckService } from '../../service/dependency-check.service';
import { GitproviderImportappStepComponent } from './gitprovider-importapp-step.component';
import { GitProviderService } from '../../service/git-provider.service';
import { GitHubDetails } from '../../model/github-details.model';
import { ExistingRepositoryValidatorDirective } from '../gitprovider-importapp-step/repository.validator';

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

const mockGitProviderService = {
  connectGitHubAccount(redirectUrl: string): void {
    const url = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId +
    '&redirect_uri=' + encodeURIComponent(redirectUrl);
  },
  getGitHubDetails(): Observable<GitHubDetails> {
    const gitHubDetails = of( <GitHubDetails>{
      avatar: 'https://avatars3.githubusercontent.com/u/17882357?v=4',
      login: 'testuser',
      organizations: ['fabric-ui']
    });
    return gitHubDetails;
  },
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    const gitHubRepo = of(true);
    return gitHubRepo;
  },
  getGitHubRepoList(org: string): Observable<any> {
    const repoList = ['fabric-ui', 'fabric-uxd'];
    return of(repoList);
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
  },
  onInViewportChange($event: any, id: string) {
    if ($event) {
      setTimeout(() => {
        this.selectedSection = id;
      }, 10); // Avoids ExpressionChangedAfterItHasBeenCheckedError
    }
  }
};

describe('Import GitProviderStepComponent', () => {
  let component: GitproviderImportappStepComponent;
  let fixture: ComponentFixture<GitproviderImportappStepComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        InViewportModule,
        TypeaheadModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        GitproviderImportappStepComponent,
        ExistingRepositoryValidatorDirective
      ],
      providers: [
        {
          provide: DependencyCheckService, useValue: mockDependencyCheckService
        },
        {
          provide: GitProviderService, useValue: mockGitProviderService
        },
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
    fixture = TestBed.createComponent(GitproviderImportappStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render users git avatar', () => {
    fixture.detectChanges();
    element = fixture.nativeElement;
    const userGitAvatar = element.querySelector('.f8launcher-provider-card-information-authorize>img');
    expect(userGitAvatar.getAttribute('src')).toContain('https://avatars3.githubusercontent.com/u/17882357?v=4');
  });

  it('should show users login', () => {
    fixture.detectChanges();
    element = fixture.nativeElement;
    const userGitLogin = element.
      querySelector('.f8launcher-provider-card-information-authorize .f8launcher-username-login');
    expect(userGitLogin.innerHTML).toContain('testuser');
  });

  it('should disable logIn button', () => {
    fixture.detectChanges();
    element = fixture.nativeElement;
    const userGitLoginBtn = element.
      querySelector('.f8launcher-provider-card-information-authorize .f8launcher-authorize-account');
    expect(userGitLoginBtn.hasAttribute('disabled'));
  });

});
