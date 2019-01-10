import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Broadcaster } from 'ngx-base';
import { AppRoutingModule } from './app-routing.module';
// App components
import { AppComponent } from './app.component';
// Main areas
import { CreateAppComponent } from './create-app/create-app.component';
import { GettingStartedLauncherComponent } from './getting-started-launcher/getting-started-launcher.component';
import { GettingStartedOsioComponent } from './getting-started-osio/getting-started-osio.component';
import { ImportAppComponent } from './import-app/import-app.component';
import { LauncherAppComponent } from './launcher-app/launcher-app.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { DemoDependencyCheckService } from './service/demo-dependency-check.service';
import { DemoGitProviderService } from './service/demo-git-provider.service';
import { DemoMissionRuntimeService } from './service/demo-mission-runtime.service';
import { DemoPipelineService } from './service/demo-pipeline.service';
import { DemoProjectProgressService } from './service/demo-project-progress.service';
import { DemoProjectSummaryService } from './service/demo-project-summary.service';
import { DemoTargetEnvironmentService } from './service/demo-target-environment.service';
import { DemoTokenService } from './service/demo-token.service';

import { Config } from '../../projects/ngx-launcher/src/lib/service/config.component';
import { FABRIC8_BUILD_TOOL_DETECTOR_API_URL } from './shared/build-tool-detector-api-url';
import { FABRIC8_FORGE_API_URL } from './shared/forge-api-url';
import { ForgeConfig } from './shared/forge-config';
import { FABRIC8_ORIGIN } from './shared/forge-origin';

import { TokenProvider } from '../../projects/ngx-launcher/src/lib/service/token-provider';
import { MockAuthenticationService } from './shared/mock-auth.service';

import { HelperService } from '../../projects/ngx-launcher/src/lib/service/helper.service';

import {
  AppCreatorService,
  DependencyCheckService,
  GitProviderService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService,
  ProjectProgressService,
  ProjectSummaryService,
  TargetEnvironmentService,
  TokenService
} from '../../projects/ngx-launcher/src/lib/launcher.module';
import { PipelineDemoComponent } from './create-app/pipeline-demo.component';
import { LauncherAppCreatorComponent } from './launcher-app-creator/launcher-app-creator.component';
import { DemoAppCreatorService } from './service/demo-app-creator.service';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    LauncherModule
  ],
  declarations: [
    AppComponent,
    CreateAppComponent,
    PipelineDemoComponent,
    GettingStartedLauncherComponent,
    GettingStartedOsioComponent,
    ImportAppComponent,
    LauncherAppComponent,
    LauncherAppCreatorComponent,
    WelcomeComponent
  ],
  providers: [
    Broadcaster,
    HelperService,
    { provide: AppCreatorService, useClass: DemoAppCreatorService },
    { provide: DependencyCheckService, useClass: DemoDependencyCheckService},
    { provide: GitProviderService, useClass: DemoGitProviderService},
    { provide: MissionRuntimeService, useClass: DemoMissionRuntimeService },
    { provide: PipelineService, useClass: DemoPipelineService },
    { provide: ProjectProgressService, useClass: DemoProjectProgressService },
    { provide: ProjectSummaryService, useClass: DemoProjectSummaryService },
    { provide: TargetEnvironmentService, useClass: DemoTargetEnvironmentService},
    { provide: Config, useClass: ForgeConfig },
    { provide: FABRIC8_FORGE_API_URL, useValue: 'https://forge.api.prod-preview.openshift.io' },
    {provide: FABRIC8_BUILD_TOOL_DETECTOR_API_URL,
      useValue: 'https://detector.api.prod-preview.openshift.io/api/detect/build/'},
    { provide: FABRIC8_ORIGIN, useValue: 'osio' },
    { provide: TokenProvider, useClass: MockAuthenticationService },
    { provide: TokenService, useClass: DemoTokenService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
