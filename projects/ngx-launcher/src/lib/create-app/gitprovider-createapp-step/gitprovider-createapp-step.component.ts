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

import { GitProviderService } from '../../service/git-provider.service';
import { Selection } from '../../model/selection.model';
import { LauncherComponent } from '../../launcher.component';
import { LauncherStep } from '../../launcher-step';
import { broadcast } from '../../shared/telemetry.decorator';
import { GitproviderCreateappReviewComponent } from './gitprovider-createapp-review.component';
import { GitHubDetails } from '../../model/github-details.model';
import { Projectile, StepState } from '../../model/summary.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-createapp-step',
  templateUrl: './gitprovider-createapp-step.component.html',
  styleUrls: ['./gitprovider-createapp-step.component.less']
})
export class GitproviderCreateappStepComponent extends LauncherStep implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('form') form: NgForm;
  @ViewChild('versionSelect') versionSelect: ElementRef;

  private subscriptions: Subscription[] = [];
  private gitHubDetails: GitHubDetails = {};

  constructor(@Host() public launcherComponent: LauncherComponent,
              private projectile: Projectile<GitHubDetails>,
              private gitProviderService: GitProviderService) {
    super(launcherComponent, GitproviderCreateappReviewComponent, projectile);
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
    const state = new StepState(this.gitHubDetails, [
      { name: 'repository', value: 'repository' },
      { name: 'organization', value: 'organization' }
    ]);
    this.projectile.setState(this.id, state);

    this.launcherComponent.addStep(this);

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
   * Navigate to next step
   */
  @broadcast('completeGitProviderStep_Create', {
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
   */
  connectAccount(): void {
    this.gitProviderService.connectGitHubAccount(this.projectile.redirectUrl);
  }
}
