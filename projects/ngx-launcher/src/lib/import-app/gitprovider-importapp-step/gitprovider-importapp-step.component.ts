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
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DependencyCheckService } from '../../service/dependency-check.service';
import { GitProviderService } from '../../service/git-provider.service';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { broadcast } from '../../shared/telemetry.decorator';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-importapp-step',
  templateUrl: './gitprovider-importapp-step.component.html',
  styleUrls: ['./gitprovider-importapp-step.component.less']
})
export class GitproviderImportappStepComponent extends LauncherStep implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('form') form: NgForm;
  @ViewChild('versionSelect') versionSelect: ElementRef;

  private subscriptions: Subscription[] = [];
  private gitHubReposSubscription: Subscription;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private gitProviderService: GitProviderService) {
    super();
  }

  ngAfterViewInit() {
    if (this.launcherComponent.summary.gitHubDetails.login) {
      setTimeout(() => {
        if (this.versionSelect) {
          this.versionSelect.nativeElement.focus();
        }
      }, 10);
    }
  }

  ngOnInit() {
    this.launcherComponent.addStep(this);

    this.subscriptions.push(this.gitProviderService.getGitHubDetails().subscribe((val) => {
      if (val !== undefined) {
        this.launcherComponent.summary.gitHubDetails = val;
        this.getGitHubRepos();
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
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    return this.form.valid;
  }

  // Steps

  /**
   * Navigate to next step
   */
  @broadcast('completeGitProviderStep_Import', {
    'launcherComponent.summary.gitHubDetails': {
      location: 'organization',
      repository: 'repository',
      username: 'login'
    }
  })
  navToNextStep(): void {
    this.launcherComponent.navToNextStep('GitProvider');
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
   * Ensure repo name is available for the selected organization
   */
  getGitHubRepos(): void {
    let org = '';
    if (this.launcherComponent && this.launcherComponent.summary &&
       this.launcherComponent.summary.gitHubDetails) {
      org = this.launcherComponent.summary.gitHubDetails.organization;
      this.launcherComponent.summary.gitHubDetails.repository = '';
      this.launcherComponent.summary.gitHubDetails.repositoryList = [];
    }

    if (this.gitHubReposSubscription !== undefined) {
      this.gitHubReposSubscription.unsubscribe();
    }
    this.gitHubReposSubscription = this.gitProviderService.getGitHubRepoList(org).subscribe((val) => {
      if (val !== undefined && this.launcherComponent && this.launcherComponent.summary &&
        this.launcherComponent.summary.gitHubDetails) {
        this.launcherComponent.summary.gitHubDetails.repositoryList = val;
      }
    });
  }

  // Private

  private getParams(selection: Selection) {
    if (selection === undefined) {
      return '';
    }
    return '?selection=' + JSON.stringify(selection);
  }

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    const search = (window.location.search !== undefined && window.location.search.length > 0)
      ? window.location.search : window.location.href;
    const param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }
}
