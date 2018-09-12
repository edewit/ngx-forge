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
import { GitHubDetails } from 'ngx-launcher/public_api';

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
              private gitProviderService: GitProviderService) {
    super(GitproviderCreateappReviewComponent);
    // this.gitHubDetails = launcherComponent.summary.gitHubDetails;
    launcherComponent.summary.setDetails(this.id, this.gitHubDetails);
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
    this.launcherComponent.addStep(this);

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
    const summary = this.launcherComponent.summary;
  }

  /**
   * Authorize GitHub account
   */
  connectAccount(): void {
    const url = window.location.href + this.getParams(this.launcherComponent.currentSelection);
    this.gitProviderService.connectGitHubAccount(url);
  }

  /**
   * get all repos List for the selected organization
   */
  getGitHubRepos(): void {
    if (this.launcherComponent && this.launcherComponent.summary &&
      this.gitHubDetails) {
      this.gitHubDetails.repository =
        this.launcherComponent.summary.dependencyCheck ?
          this.launcherComponent.summary.dependencyCheck.projectName : '';
    }
  }

  // Private

  private getParams(selection: Selection) {
    if (selection === undefined) {
      return '';
    }
    return '?selection=' + encodeURI(JSON.stringify(selection));
  }
}
