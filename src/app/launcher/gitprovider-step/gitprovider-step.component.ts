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
  private _ghAvatar: string;
  private _ghLogin: string;
  private _ghToken: string;
  private subscriptions: Subscription[] = [];
  private ghUser: GitHubUser;

  constructor(@Host() public wizardComponent: WizardComponent,
              private gitProviderService: GitProviderService) {
    super();
  }

  ngOnInit() {
    this.wizardComponent.addStep(this);
    this.subscriptions.push(
      this.gitProviderService.getToken().subscribe((val) => {
        if (val !== undefined) {
          this._ghToken = val;
        }
      }));
    this.subscriptions.push(
      this.gitProviderService.getUser().subscribe((val) => {
        if (val !== undefined) {
          this.ghUser = val;
          this._ghAvatar = this.ghUser.avatar_url;
          this._ghLogin = this.ghUser.login;
        }
      }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Accessors

  get ghAvatar(): string {
    return this._ghAvatar;
  }

  get ghLogin(): string {
    return this._ghLogin;
  }

  get ghToken(): string {
    return this._ghToken;
  }

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get stepCompleted(): boolean {
    return true; // Todo: Set to true for testing
  }

  // Steps

  /**
   * Navigate to next step
   */
  navToNextStep(): void {
    this.wizardComponent.getStep(this.id).completed = this.stepCompleted;
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
}
