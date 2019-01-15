import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';

import { Broadcaster } from 'ngx-base';
import { PopoverModule, TypeaheadModule } from 'ngx-bootstrap';
import { GitProviderService } from '../../service/git-provider.service';
import { GitproviderStepComponent } from './gitprovider-step.component';

import { GitHubDetails } from '../../model/github-details.model';
import { Projectile } from '../../model/projectile.model';
import { ButtonNextStepComponent } from '../../shared/button-next-step.component';
import { BroadcasterTestProvider } from '../targetenvironment-step/target-environment-step.component.spec';
import { GitProviderRepositoryValidatorDirective } from './gitprovider-repository.validator';

const mockGitProviderService = {
  connectGitHubAccount(redirectUrl: string): void {
    const url = 'https://github.com/login/oauth/authorize?client_id=' + this.clientId +
    '&redirect_uri=' + encodeURIComponent(redirectUrl);
  },
  getGitHubDetails(): Observable<GitHubDetails> {
    const gitHubDetails = of(<GitHubDetails> {
      avatar: 'https://avatars3.githubusercontent.com/u/17882357?v=4',
      login: 'testuser',
      organizations: {'fabric-ui': 'fabric-ui'},
      repositoryList: ['test', 'ngx-launcher', 'fabric-ui']
    });
    return gitHubDetails;
  },
  isGitHubRepo(org: string, repoName: string): Observable<boolean> {
    const gitHubRepo = of(true);
    return gitHubRepo;
  },
  getGitHubRepoList(org: string): Observable<any> {
    const gitHubRepoList = of(['fabric8-ui']);
    return gitHubRepoList;
  }
};

describe('GitProviderStepComponent', () => {
  let component: GitproviderStepComponent;
  let fixture: ComponentFixture<GitproviderStepComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        PopoverModule.forRoot(),
        RouterTestingModule,
        TypeaheadModule
      ],
      declarations: [
        GitproviderStepComponent,
        ButtonNextStepComponent,
        GitProviderRepositoryValidatorDirective
      ],
      providers: [
        Projectile,
        {
          provide: GitProviderService, useValue: mockGitProviderService
        },
        { provide: Broadcaster, useValue: BroadcasterTestProvider.broadcaster }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitproviderStepComponent);
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

  it('should show location column', () => {
    fixture.detectChanges();
    element = fixture.nativeElement;
    const userGitLocation = element.
      querySelector('#ghOrg');
    expect(userGitLocation.innerHTML).toContain('fabric-ui');
  });

  it('should show repository column for create flow', () => {
    fixture.detectChanges();
    element = fixture.nativeElement;
    const userGitLocation = element.
      querySelector('#ghOrg');
    userGitLocation.setAttribute('val', 'fabric-ui');
    expect(userGitLocation.innerHTML).toContain('fabric-ui');
    const userGitRepo = element.
      querySelector('#ghRepo');
    userGitRepo.setAttribute('val', 'app-test-1');
    expect(component.import).isNot;
    component.gitHubDetails.repository = 'app-test-1';
    expect(component.gitHubDetails.repository).toEqual('app-test-1');
    expect(userGitRepo.getAttribute('val')).toContain('app-test-1');
    expect(component.completed).toBe(true);
  });

  it('should show repository column for import flow', async (() => {
    fixture.detectChanges();
    element = fixture.nativeElement;
    const userGitLocation = element.
      querySelector('#ghOrg');
    component.import = true;
    userGitLocation.setAttribute('val', 'fabric-ui');
    expect(userGitLocation.getAttribute('val')).toContain('fabric-ui');
    const userGitRepo = element.
      querySelector('#ghRepo');
    expect(component.import).toBe(true);
    component.gitHubDetails.repository = 'test';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
    userGitRepo.setAttribute('val', 'test');
    expect(component.gitHubDetails.repositoryList).toContain('test');
    expect(userGitRepo.getAttribute('val')).toBe('test');
    const gitRepoDropdown = element.
      querySelector('#gitRt');
    expect(gitRepoDropdown.innerHTML).toContain('test');
    component.isRuntimeDetected = true;
    expect(component.completed).toBe(true);
  });
  }));
});
