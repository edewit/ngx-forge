import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Host,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Broadcaster } from 'ngx-base';
import { Subscription } from 'rxjs';
import { BuildTool } from './../../model/build-tool.model';

import { LauncherStep } from '../../launcher-step';
import { LauncherComponent } from '../../launcher.component';
import { GitHubDetails } from '../../model/github-details.model';
import { Projectile, StepState } from '../../model/projectile.model';
import { GitProviderService } from '../../service/git-provider.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-gitprovider-step',
  templateUrl: './gitprovider-step.component.html',
  styleUrls: ['./gitprovider-step.component.less']
})
export class GitproviderStepComponent extends LauncherStep implements AfterViewInit, OnDestroy, OnInit, DoCheck {
  @Input() import: boolean;
  @ViewChild('form') form: NgForm;
  @ViewChild('versionSelect') versionSelect: ElementRef;

  private projectNameDiff: KeyValueDiffer<string, any>;
  private subscriptions: Subscription[] = [];
  private _organizationsKeys;
  gitHubDetails: GitHubDetails = {};
  gitHubReposSubscription: Subscription;
  detectedTool: BuildTool;
  runtimeDetectionSecVisible: boolean = false;
  isRuntimeDetected: boolean = false;

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
              private projectile: Projectile<GitHubDetails>,
              differs: KeyValueDiffers,
              private gitProviderService: GitProviderService,
              private broadcaster: Broadcaster) {
    super(projectile);
    this.projectNameDiff = differs.find(this.projectile.sharedState.state).create();
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

  ngDoCheck(): void {
    const changes = this.projectNameDiff.diff(this.projectile.sharedState.state);
    if (changes) {
      changes.forEachChangedItem(item => {
        if (item.key === 'projectName' && item.previousValue === this.gitHubDetails.repository) {
          this.gitHubDetails.repository = item.currentValue;
        }
      });
    }
  }

  ngOnInit() {
    this.gitHubDetails.repository = this.import ? '' : this.projectile.sharedState.state.projectName;
    this.gitHubDetails.repositoryList = [];
    const state = new StepState(this.gitHubDetails, [
      { name: 'gitRepository', value: 'repository' },
      { name: 'gitOrganization', value: 'organization' }
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
    this.gitHubDetails.organization = model.gitOrganization;
    this.gitHubDetails.repository = model.gitRepository;
  }

  // Accessors

  /**
   * Returns indicator that step is completed
   *
   * @returns {boolean} True if step is completed
   */
  get completed(): boolean {
    if (this.import) {
      return this.form.valid && this.isRuntimeDetected;
    }
    return this.form.valid;
  }

  // Steps

  /**
   * Authorize GitHub account
   */
  connectAccount(): void {
    this.gitProviderService.connectGitHubAccount(this.projectile.redirectUrl);
  }

  get organizationsKeys(): IterableIterator<string> {
    if (!this._organizationsKeys && this.gitHubDetails.organizations) {
      this._organizationsKeys = Object.keys(this.gitHubDetails.organizations);
    }
    return this._organizationsKeys;
  }

  getGitHubRepos(value: string): void {
    if (this.import) {
      if (this.gitHubReposSubscription) {
        this.gitHubReposSubscription.unsubscribe();
      }
      const org = value || this.gitHubDetails.login;
      this.gitHubReposSubscription = this.gitProviderService.getGitHubRepoList(org)
        .subscribe(list => this.gitHubDetails.repositoryList = list);
    }
  }

  onRepositorySelect(repo) {
    let repoUrl = 'https://github.com/' + this.gitHubDetails.organization + '/' + repo.value;
    if (this.gitHubDetails.organization === undefined) {
      repoUrl = 'https://github.com/' + this.gitHubDetails.login + '/' + repo.value;
    }
    this.runtimeDetectionSecVisible = true;
    this.isRuntimeDetected = false;
    this.gitProviderService.getDetectedBuildRuntime(encodeURIComponent(repoUrl))
      .subscribe((detectedTool: BuildTool) => {
        this.detectedTool = detectedTool;
        let dTool = detectedTool['build-tool-type'];
        if (detectedTool['build-tool-type'] === 'nodejs') {
          dTool = 'node';
        }
        this.broadcaster.broadcast('buildTool-detected', dTool);
        this.isRuntimeDetected = true;
    });
  }

  onChangeBuildTool(buildTool: string) {
    if (buildTool === 'nodejs') {
      buildTool = 'node';
    }
    this.broadcaster.broadcast('buildTool-detected', buildTool);
  }
}
