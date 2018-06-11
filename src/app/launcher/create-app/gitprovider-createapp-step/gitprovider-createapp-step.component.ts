import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BroadcastService } from '../../service/broadcast.service';

import { DependencyCheckService } from '../../service/dependency-check.service';
import { GitProviderService } from '../../service/git-provider.service';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-createapp-step',
  templateUrl: './gitprovider-createapp-step.component.html',
  styleUrls: ['./gitprovider-createapp-step.component.less']
})
export class GitproviderCreateappStepComponent extends LauncherStep implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('versionSelect') versionSelect: ElementRef;

  private subscriptions: Subscription[] = [];
  private gitHubReposSubscription: Subscription;
  private isGitHubRepoNameDup: boolean = false;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private gitProviderService: GitProviderService,
              private broadcaster: BroadcastService) {
    super();
  }

  ngAfterViewInit() {
    if (this.launcherComponent.summary.gitHubDetails.authenticated === true) {
      setTimeout(() => {
        this.versionSelect.nativeElement.focus();
      }, 10);
    }
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);

    this.subscriptions.push(this.gitProviderService.getGitHubDetails().subscribe((val) => {
      if (val !== undefined) {
        this.launcherComponent.summary.gitHubDetails = val;
        this.getGitHubRepos();
        this.initCompleted();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    if (this.gitHubReposSubscription !== undefined) {
      this.gitHubReposSubscription.unsubscribe();
    }
  }

  // Accessors

  /**
   * Returns duplicate name message for when repo exists
   *
   * @returns {string}
   */
  get duplicateNameMessage(): string {
    let repo: string = '';
    let repoList: any[] = [];
    this.isGitHubRepoNameDup = false;
    if (this.launcherComponent && this.launcherComponent.summary &&
      this.launcherComponent.summary.gitHubDetails) {
      repo = this.launcherComponent.summary.gitHubDetails.repository;
      repoList = this.launcherComponent.summary.gitHubDetails.repositoryList;
      repoList.indexOf(repo) !== -1 ? this.isGitHubRepoNameDup = true : this.isGitHubRepoNameDup = false;
    }
    if (this.isGitHubRepoNameDup) {
      return 'Duplicate Name: ' + '\'' + repo + '\' is already in use as ' +
        this.launcherComponent.summary.gitHubDetails.organization + '/' + repo + '.';
    } else {
      return '\'' + repo +
        '\' is not a valid name, only alphanumeric characters are allowed with "-", "_" or "." ';
    }
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.launcherComponent.summary.gitHubDetails.authenticated === true
      && this.launcherComponent.summary.gitHubDetails.login !== undefined
      && this.launcherComponent.summary.gitHubDetails.organization !== undefined
      && this.launcherComponent.summary.gitHubDetails.repository !== undefined
      && this.launcherComponent.summary.gitHubDetails.repository.length > 0
      && this.launcherComponent.summary.gitHubDetails.repositoryAvailable === true);
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.launcherComponent.navToNextStep();
    this.broadcaster.broadcast('completeGitProviderStep_Create', {
      location: this.launcherComponent.summary.gitHubDetails.organization,
      username: this.launcherComponent.summary.gitHubDetails.login,
      repository: this.launcherComponent.summary.gitHubDetails.repository
    });
  }

  /**
   * Authorize GitHub account
   *
   * @param {MouseEvent} $event
   */
  connectAccount($event: MouseEvent): void {
    let url = window.location.href + this.getParams(this.launcherComponent.currentSelection);
    this.gitProviderService.connectGitHubAccount(url);
  }

  /**
   * Update selection
   */
  updateGitHubSelection(): void {
    this.initCompleted();
  }

  /**
   * get all repos List for the selected organization
   */
  getGitHubRepos(): void {
    let org = '';
    if (this.launcherComponent && this.launcherComponent.summary &&
      this.launcherComponent.summary.gitHubDetails) {
      if (this.launcherComponent.summary.dependencyCheck.projectName) {
        this.launcherComponent.summary.dependencyCheck.projectName =
          this.launcherComponent.summary.dependencyCheck.projectName.toLowerCase();
      }
      org = this.launcherComponent.summary.gitHubDetails.organization;
      this.launcherComponent.summary.gitHubDetails.repository =
        this.launcherComponent.summary.dependencyCheck ?
          this.launcherComponent.summary.dependencyCheck.projectName : '';
      this.launcherComponent.summary.gitHubDetails.repositoryList = [];
    }

    this.initCompleted();
    if (this.gitHubReposSubscription !== undefined) {
      this.gitHubReposSubscription.unsubscribe();
    }
    this.gitHubReposSubscription = this.gitProviderService.getGitHubRepoList(org).subscribe((val) => {
      if (val !== undefined && this.launcherComponent && this.launcherComponent.summary &&
        this.launcherComponent.summary.gitHubDetails) {
        this.launcherComponent.summary.gitHubDetails.repositoryList = val;
        this.validateRepo();
      }
    });
  }

  /**
   * Ensure repo name is available for the selected organization
   */
  validateRepo(): void {
    let repoName = '';
    let repoList = [];
    // gitRepository should consist only alphanumeric characters, '-', '_' or '.'"
    const pattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]{1,63}$/;
    this.isGitHubRepoNameDup = false;
    if (this.launcherComponent && this.launcherComponent.summary &&
      this.launcherComponent.summary.gitHubDetails) {
      repoName = this.launcherComponent.summary.gitHubDetails.repository;
      repoList = this.launcherComponent.summary.gitHubDetails.repositoryList;
    }
    if (!pattern.test(repoName)) {
      this.launcherComponent.summary.gitHubDetails.repositoryAvailable = false;
    } else if (repoList.indexOf(repoName) !== -1) {
      this.isGitHubRepoNameDup = true;
      this.launcherComponent.summary.gitHubDetails.repositoryAvailable = false;
    } else {
      this.launcherComponent.summary.gitHubDetails.repositoryAvailable = true;
      if (this.launcherComponent.flow === 'osio') {
        if (this.launcherComponent.summary.gitHubDetails.repository) {
          this.launcherComponent.summary.gitHubDetails.repository =
            this.launcherComponent.summary.gitHubDetails.repository.toLowerCase();
        }
      }
    }
    this.initCompleted();
  }

  // Private

  private getParams(selection: Selection) {
    if (selection === undefined) {
      return '';
    }
    return '?selection=' + encodeURI(JSON.stringify(selection));
  }

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let search = (window.location.search !== undefined && window.location.search.length > 0)
      ? window.location.search : window.location.href;
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private initCompleted(): void {
    this.completed = this.stepCompleted;
  }
}
