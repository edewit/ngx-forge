import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-modal';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { SortArrayPipeModule, TruncatePipeModule } from 'patternfly-ng/pipe';
import { ToolbarModule } from 'patternfly-ng/toolbar';
import { CancelOverlayComponent } from './cancel-overlay/cancel-overlay.component';
// Note: This has to be imported first
import { StepIndicatorComponent } from './step-indicator/step-indicator.component';

import {
  ActivateBoosterNextstepComponent
} from './components/activate-booster-nextstep/activate-booster-nextstep.component';
import { CapabilitiesStepComponent } from './components/capabilities-step/capabilities-step.component';
import {
  GitProviderRepositoryValidatorDirective
} from './components/gitprovider-step/gitprovider-repository.validator';
import { GitproviderStepComponent } from './components/gitprovider-step/gitprovider-step.component';
import { LinkAccountsStepComponent } from './components/link-accounts-step/link-accounts-step.component';
import { MissionRuntimeStepComponent } from './components/mission-runtime-step/mission-runtime-step.component';
import {
  ProjectProgressNextstepComponent
} from './components/project-progress-nextstep/project-progress-nextstep.component';
import { ProjectSummaryStepComponent } from './components/project-summary-step/project-summary-step.component';
import { ReleaseStrategyStepComponent } from './components/release-strategy-step/release-strategy-step.component';
import { TargetEnvironmentStepComponent } from './components/targetenvironment-step/target-environment-step.component';
import { LowerCaseDirective } from './shared/lowercase.directive';
import { ProjectNameValidatorDirective } from './shared/project-name.validator';

import { ToastNotificationComponent } from './toast-notification/toast-notification.component';

import { GitproviderReviewComponent } from './components/gitprovider-step/gitprovider-review.component';
import { MissionRuntimeReviewComponent } from './components/mission-runtime-step/mission-runtime-review.component';

import { Broadcaster } from 'ngx-base';
import { InputComponent } from './components/capabilities-step/input.component';
import { ReleaseStrategyReviewComponent } from './components/release-strategy-step/release-strategy-review.component';
import { RuntimeStepComponent } from './components/runtime-step/runtime-step.component';
import {
  TargetEnvironmentReviewComponent
} from './components/targetenvironment-step/target-environment-review.component';
import { LauncherComponent } from './launcher.component';
import { Projectile } from './model/projectile.model';
import { ButtonNextStepComponent } from './shared/button-next-step.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    PopoverModule.forRoot(),
    RouterModule,
    SortArrayPipeModule,
    ToolbarModule,
    TruncatePipeModule,
    TypeaheadModule.forRoot()
  ],
  exports: [
    LauncherComponent,
    StepIndicatorComponent,
    TargetEnvironmentStepComponent,
    MissionRuntimeStepComponent,
    RuntimeStepComponent,
    CapabilitiesStepComponent,
    GitproviderStepComponent,
    ProjectSummaryStepComponent,
    TargetEnvironmentReviewComponent,
    GitproviderReviewComponent,
    ReleaseStrategyStepComponent,
    ReleaseStrategyReviewComponent,
    MissionRuntimeReviewComponent
  ],
  declarations: [
    ButtonNextStepComponent,
    InputComponent,
    ActivateBoosterNextstepComponent,
    CancelOverlayComponent,
    GitproviderStepComponent,
    LowerCaseDirective,
    ProjectNameValidatorDirective,
    GitProviderRepositoryValidatorDirective,
    GitproviderReviewComponent,
    MissionRuntimeReviewComponent,
    MissionRuntimeStepComponent,
    RuntimeStepComponent,
    CapabilitiesStepComponent,
    ProjectProgressNextstepComponent,
    ProjectSummaryStepComponent,
    ReleaseStrategyStepComponent,
    ReleaseStrategyReviewComponent,
    TargetEnvironmentStepComponent,
    TargetEnvironmentReviewComponent,
    LinkAccountsStepComponent,
    StepIndicatorComponent,
    ToastNotificationComponent,
    LauncherComponent
  ],
  providers: [
    BsDropdownConfig,
    Broadcaster,
    Projectile,
    LauncherComponent
  ]
})
export class LauncherModule {
}

// Models
export { Cluster } from './model/cluster.model';
export { DependencyCheck } from './model/dependency-check.model';
export { GitHubDetails } from './model/github-details.model';
export { Mission } from './model/mission.model';
export { Pipeline } from './model/pipeline.model';
export { Progress } from './model/progress.model';
export { Runtime } from './model/runtime.model';
export { Projectile } from './model/projectile.model';
export { TargetEnvironment } from './model/target-environment.model';

// Services
export { ClusterService } from './service/cluster.service';
export { AppCreatorService } from './service/app-creator.service';
export { DependencyCheckService } from './service/dependency-check.service';
export { GitProviderService } from './service/git-provider.service';
export { MissionRuntimeService } from './service/mission-runtime.service';
export { PipelineService } from './service/pipeline.service';
export { ProjectProgressService } from './service/project-progress.service';
export { ProjectSummaryService } from './service/project-summary.service';
export { TargetEnvironmentService } from './service/target-environment.service';
export { TokenService } from './service/token.service';

// Utility Service
export { HelperService } from './service/helper.service';
