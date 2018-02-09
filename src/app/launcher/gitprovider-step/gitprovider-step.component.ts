import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { GitHubDetails } from '../model/github-details.model';
import { GitProviderService } from '../service/git-provider.service';
import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-step',
  templateUrl: './gitprovider-step.component.html',
  styleUrls: ['./gitprovider-step.component.less']
})
export class GitProviderStepComponent extends WizardStep implements OnDestroy, OnInit {
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private gitProviderService: GitProviderService) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);

    this.subscriptions.push(this.gitProviderService.getGitHubDetails().subscribe((val) => {
      if (val !== undefined) {
        this.wizardComponent.summary.gitHubDetails = val;
        this.initCompleted();
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
   * Returns duplicate name message for when repo exists
   *
   * @returns {string}
   */
  get duplicateNameMessage(): string {
    let repo = this.wizardComponent.summary.gitHubDetails.repository;
    return '\'' + repo + '\' is already in use as ' + this.wizardComponent.summary.gitHubDetails.organization
      + '/' + repo + '.';
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.wizardComponent.summary.gitHubDetails.authenticated === true
      && this.wizardComponent.summary.gitHubDetails.login !== undefined
      && this.wizardComponent.summary.gitHubDetails.organization !== undefined
      && this.wizardComponent.summary.gitHubDetails.repository !== undefined
      && this.wizardComponent.summary.gitHubDetails.repository.length > 0
      && this.wizardComponent.summary.gitHubDetails.repositoryAvailable === true);
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.wizardComponent.navToNextStep();
  }

  /**
   * Authorize GitHub account
   *
   * @param {MouseEvent} $event
   */
  connectAccount($event: MouseEvent): void {
    let url = window.location.origin + window.location.pathname + this.getParams(this.wizardComponent.currentSelection);
    this.gitProviderService.connectGitHubAccount(url);
  }

  /**
   * Update selection
   */
  updateGitHubSelection(): void {
    this.initCompleted();
  }

  /**
   * Ensure repo name is available for the selected organization
   */
  validateRepo(): void {
    let fullName = this.wizardComponent.summary.gitHubDetails.organization + '/'
      + this.wizardComponent.summary.gitHubDetails.repository;

    this.subscriptions.push(this.gitProviderService.isGitHubRepo(fullName).subscribe((val) => {
      if (val !== undefined) {
        this.wizardComponent.summary.gitHubDetails.repositoryAvailable = !val;
        this.initCompleted();
      }
    }));
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
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private initCompleted(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
  }
}
