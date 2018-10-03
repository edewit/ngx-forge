import {
  AfterViewInit,
  Component,
  ElementRef,
  Host,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Optional,
  Input
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { GitProviderService } from '../../service/git-provider.service';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { broadcast } from '../../shared/telemetry.decorator';
import { GitHubDetails } from '../../model/github-details.model';
import { Projectile, StepState } from '../../model/projectile.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-createapp-step',
  templateUrl: './gitprovider-createapp-step.component.html',
  styleUrls: ['./gitprovider-createapp-step.component.less']
})
export class GitproviderCreateappStepComponent extends LauncherStep implements AfterViewInit, OnDestroy, OnInit {
  @Input() import: boolean;
  @ViewChild('form') form: NgForm;
  @ViewChild('versionSelect') versionSelect: ElementRef;

  private subscriptions: Subscription[] = [];
  gitHubDetails: GitHubDetails = {};
  gitHubReposSubscription: Subscription;

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
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
    this.gitHubDetails.repository = this.import ? '' : this.projectile.sharedState.state.projectName;
    this.gitHubDetails.repositoryList = [];
    const state = new StepState(this.gitHubDetails, [
      { name: 'repository', value: 'repository' },
      { name: 'organization', value: 'organization' }
    ]);
    this.projectile.setState(this.id, state);
    if (this.launcherComponent) {
      this.launcherComponent.addStep(this);
    }

    this.subscriptions.push(this.gitProviderService.getGitHubDetails().subscribe((val) => {
      if (val !== undefined) {
        Object.assign(this.gitHubDetails, val);
        this.restore();
      }
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  restoreModel(model: any): void {
    this.gitHubDetails.organization = model.organization;
    this.gitHubDetails.repository = model.repository;
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
   * Authorize GitHub account
   */
  connectAccount(): void {
    this.gitProviderService.connectGitHubAccount(this.projectile.redirectUrl);
  }

  getGitHubRepos(): void {
    if (this.import) {
      if (this.gitHubReposSubscription) {
        this.gitHubReposSubscription.unsubscribe();
      }
      this.gitHubReposSubscription = this.gitProviderService.getGitHubRepoList(this.gitHubDetails.organization)
        .subscribe(list => this.gitHubDetails.repositoryList = list);
    }
  }
}
