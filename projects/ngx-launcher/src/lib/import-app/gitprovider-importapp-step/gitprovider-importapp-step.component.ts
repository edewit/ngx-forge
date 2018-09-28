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
import { Projectile } from '../../model/summary.model';
import { GitHubDetails } from '../../model/github-details.model';

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
  gitHubDetails: GitHubDetails;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private dependencyCheckService: DependencyCheckService,
              private projectile: Projectile<GitHubDetails>,
              private gitProviderService: GitProviderService) {
    super(projectile);
  }

  ngAfterViewInit() {
    if (this.gitHubDetails.login) {
      setTimeout(() => {
        if (this.versionSelect) {
          this.versionSelect.nativeElement.focus();
        }
      }, 10);
    }
  }

  ngOnInit() {
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }

    this.subscriptions.push(this.gitProviderService.getGitHubDetails().subscribe((val) => {
      if (val !== undefined) {
        this.gitHubDetails = val;
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
    this.gitProviderService.connectGitHubAccount(this.projectile.redirectUrl);
  }

  /**
   * Ensure repo name is available for the selected organization
   */
  getGitHubRepos(): void {
    // let org = '';
    // if (this.launcherComponent && this.launcherComponent.summary &&
    //    this.launcherComponent.summary.gitHubDetails) {
    //   org = this.launcherComponent.summary.gitHubDetails.organization;
    //   this.launcherComponent.summary.gitHubDetails.repository = '';
    //   this.launcherComponent.summary.gitHubDetails.repositoryList = [];
    // }

    // if (this.gitHubReposSubscription !== undefined) {
    //   this.gitHubReposSubscription.unsubscribe();
    // }
    // this.gitHubReposSubscription = this.gitProviderService.getGitHubRepoList(org).subscribe((val) => {
    //   if (val !== undefined && this.launcherComponent && this.launcherComponent.summary &&
    //     this.launcherComponent.summary.gitHubDetails) {
    //     this.launcherComponent.summary.gitHubDetails.repositoryList = val;
    //   }
    // });
  }

  restoreModel(model: any): void {
    this.gitHubDetails.organization = model.organization;
    this.gitHubDetails.repository = model.repository;
  }

  saveModel(): any {
    return { organization: this.gitHubDetails.organization, repository: this.gitHubDetails.repository };
  }
}
