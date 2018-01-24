// import './rxjs-extensions';

import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Main areas
import { WelcomeComponent } from './components/welcome.component';

import { InViewportModule, WindowRef } from '@thisissoon/angular-inviewport';
import { LauncherModule } from '../app/launcher/launcher.module';
import { DemoMissionRuntimeService } from './service/demo-mission-runtime.service';
import { MissionRuntimeService, PipelineService } from '../app/launcher/launcher.module';
import { DemoPipelineService } from './service/demo-pipeline.service';

// Provide window object so as to not break SSR if using universal
export const getWindow = () => window;
export const providers: Provider[] = [
  { provide: WindowRef, useFactory: (getWindow) }
];

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    LauncherModule,
    InViewportModule.forRoot(providers)
  ],
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  providers: [
    { provide: MissionRuntimeService, useClass: DemoMissionRuntimeService },
    { provide: PipelineService, useClass: DemoPipelineService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
