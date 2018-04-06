// import './rxjs-extensions';

import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DependencyEditorTokenProvider, URLProvider } from 'fabric8-analytics-dep-editor';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Main areas
import { CreateAppComponent } from './create-app/create-app.component';
import { GettingStartedLauncherComponent } from './getting-started-launcher/getting-started-launcher.component';
import { GettingStartedOsioComponent } from './getting-started-osio/getting-started-osio.component';
import { LauncherAppComponent } from './launcher-app/launcher-app.component';
import { ImportAppComponent } from './import-app/import-app.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { DemoDependencyCheckService } from './service/demo-dependency-check.service';
import { DemoGitProviderService } from './service/demo-git-provider.service';
import { DemoMissionRuntimeService } from './service/demo-mission-runtime.service';
import { DemoPipelineService } from './service/demo-pipeline.service';
import { DemoProjectProgressService } from './service/demo-project-progress.service';
import { DemoProjectSummaryService } from './service/demo-project-summary.service';
import { DemoTargetEnvironmentService } from './service/demo-target-environment.service';
import { DemoTokenService } from './service/demo-token.service';

import { Config } from '../app/service/config.component';
import { ForgeConfig } from './shared/forge-config';
import { FABRIC8_FORGE_API_URL } from './shared/forge-api-url';
import { FABRIC8_ORIGIN } from './shared/forge-origin';

import { TokenProvider } from '../app/service/token-provider';
import { MockAuthenticationService } from './shared/mock-auth.service';
import { AnalyticsUrlService } from './shared/analytics-url.service';

import { HelperService } from '../app/launcher/service/helper.service';

import {
  DependencyCheckService,
  GitProviderService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService,
  ProjectProgressService,
  ProjectSummaryService,
  TargetEnvironmentService,
  TokenService
} from '../app/launcher/launcher.module';

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    LauncherModule
  ],
  declarations: [
    AppComponent,
    CreateAppComponent,
    GettingStartedLauncherComponent,
    GettingStartedOsioComponent,
    ImportAppComponent,
    LauncherAppComponent,
    WelcomeComponent
  ],
  providers: [
    HelperService,
    { provide: DependencyCheckService, useClass: DemoDependencyCheckService},
    { provide: GitProviderService, useClass: DemoGitProviderService},
    { provide: MissionRuntimeService, useClass: DemoMissionRuntimeService },
    { provide: PipelineService, useClass: DemoPipelineService },
    { provide: ProjectProgressService, useClass: DemoProjectProgressService },
    { provide: ProjectSummaryService, useClass: DemoProjectSummaryService },
    { provide: TargetEnvironmentService, useClass: DemoTargetEnvironmentService},
    { provide: Config, useClass: ForgeConfig },
    { provide: FABRIC8_FORGE_API_URL, useValue: 'https://forge.api.prod-preview.openshift.io' },
    { provide: FABRIC8_ORIGIN, useValue: 'osio' },
    { provide: TokenProvider, useClass: MockAuthenticationService },
    { provide: TokenService, useClass: DemoTokenService},
    { provide: DependencyEditorTokenProvider, useExisting: TokenProvider },
    { provide: URLProvider, useClass: AnalyticsUrlService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
