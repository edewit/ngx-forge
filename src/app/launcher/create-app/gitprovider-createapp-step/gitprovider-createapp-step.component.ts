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

  constructor(@Host() public launcherComponent: LauncherComponent,
              private gitProviderService: GitProviderService) {
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
    let repo = this.launcherComponent.summary.gitHubDetails.repository;
    return '\'' + repo + '\' is already in use as ' + this.launcherComponent.summary.gitHubDetails.organization
      + '/' + repo + '.';
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
  }

  /**
   * Authorize GitHub account
   *
   * @param {MouseEvent} $event
   */
  connectAccount($event: MouseEvent): void {
    let url = window.location.origin + window.location.pathname +
      this.getParams(this.launcherComponent.currentSelection);
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
    let fullName = this.launcherComponent.summary.gitHubDetails.organization + '/'
      + this.launcherComponent.summary.gitHubDetails.repository;

    this.subscriptions.push(this.gitProviderService.isGitHubRepo(fullName).subscribe((val) => {
      if (val !== undefined) {
        this.launcherComponent.summary.gitHubDetails.repositoryAvailable = !val;
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
    this.launcherComponent.getStep(this.id).completed = this.stepCompleted;
  }
}
