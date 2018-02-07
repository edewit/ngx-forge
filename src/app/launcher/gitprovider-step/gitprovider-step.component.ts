import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { GitProviderService } from '../service/gitprovider.service';
import { Selection } from '../model/selection.model';
import { WizardComponent } from '../wizard.component';
import { WizardStep } from '../wizard-step';

import {
  GitHubRepo,
  GitHubRepoCommit,
  GitHubRepoDetails,
  GitHubRepoLastCommit,
  GitHubRepoLicense,
  GitHubUser
} from '../model/github.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-step',
  templateUrl: './gitprovider-step.component.html',
  styleUrls: ['./gitprovider-step.component.less']
})
export class GitProviderStepComponent extends WizardStep implements OnDestroy, OnInit {
  private _ghOrgs: any[];
  private ghUser: GitHubUser;
  private subscriptions: Subscription[] = [];

  constructor(@Host() public wizardComponent: WizardComponent,
              private gitProviderService: GitProviderService) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
    this.subscriptions.push(this.gitProviderService.getOrgs().subscribe((val) => {
      if (val !== undefined) {
        this._ghOrgs = val;
        this.wizardComponent.summary.githubOrg = this._ghOrgs[0].name; // default
        this.restoreSummary();
      }
    }));
    this.subscriptions.push(this.gitProviderService.getUser().subscribe((val) => {
      if (val !== undefined) {
        this.ghUser = val;
        this.wizardComponent.summary.githubLogin = this.ghUser.login;
        this.wizardComponent.summary.githubAvatar = this.ghUser.avatar_url;
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
   * Returns GitHub organizations
   *
   * @returns {any[]}
   */
  get ghOrgs(): any[] {
    return this._ghOrgs;
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return (this.wizardComponent.summary.githubLogin !== undefined
      && this.wizardComponent.summary.githubOrg !== undefined
      && this.wizardComponent.summary.githubRepo !== undefined
      && this.wizardComponent.summary.githubRepo.length > 0);
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
  authorizeAccount($event: MouseEvent): void {
    let url = window.location.origin + this.getParams(this.wizardComponent.selection);
    this.gitProviderService.authorize(url);
  }

  /**
   * Change GitHub account
   *
   * @param {MouseEvent} $event
   */
  changeAccount($event: MouseEvent): void {
    let url = window.location.origin + this.getParams(this.wizardComponent.selection);
    this.gitProviderService.authorize(url);
  }

  updateGithubSelection(): void {
    this.initCompleted();
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

  // Restore mission & runtime summary
  private restoreSummary(): void {
    let selection: Selection = this.wizardComponent.selectionParams;
    if (selection === undefined) {
      return;
    }
    this.wizardComponent.summary.githubOrg = selection.githubOrg;
    this.wizardComponent.summary.githubRepo = selection.githubRepo;
    this.initCompleted();
  }
}
