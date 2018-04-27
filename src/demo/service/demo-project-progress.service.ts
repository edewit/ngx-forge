import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, Subject } from 'rxjs';

import { Progress } from '../../app/launcher/launcher.module';
import { ProjectProgressService } from '../../app/launcher/launcher.module';
import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';

@Injectable()
export class DemoProjectProgressService implements ProjectProgressService {
  private progress: any[] = [
    {
      statusMessage: "GITHUB_CREATE",
      data: {
        location: "https://github.com/fabric8-launcher/launcher-backend"
      }
    },
    { statusMessage: "GITHUB_PUSHED" },
    {
      statusMessage: "OPENSHIFT_CREATE",
      data: {
        location: "https://console.starter-us-east-2.openshift.com/console/projects"
      }
    },
    { statusMessage: "OPENSHIFT_PIPELINE" },
    { statusMessage: "GITHUB_WEBHOOK" }
  ];
  private _progressSubject: Subject<any[]> = new Subject();
  private timer: Subscription;
  private init: any[] = [
    {GITHUB_CREATE: "Creating your new GitHub repository"},
    {GITHUB_PUSHED: "Pushing your customized Booster code into the repo"},
    {OPENSHIFT_CREATE:"Creating your project on OpenShift Online"},
    {OPENSHIFT_PIPELINE:"Setting up your build pipeline"},
    {GITHUB_WEBHOOK:"Configuring to trigger builds on Git pushes"}
  ];

  getProgress(): WebSocket {
    this.initTimer(); // Timer to simulate progress
    const socket = new WebSocket('wss://echo.websocket.org');
    this._progressSubject.subscribe(item => {
      socket.onmessage({data: JSON.stringify(item)} as MessageEvent);
    });
    return socket;
  }

  // Timer to simulate progress
  private initTimer(): void {
    if (this.timer !== undefined) {
      this.timer.unsubscribe();
    }
    let i = 0;
    this.timer = Observable
      .timer(0, 2500) // timer(firstValueDelay, intervalBetweenValues)
      .do(() => {
        if (this.init) {
          this._progressSubject.next(this.init);
          this.init = null;
        }
      })
      .subscribe(value => {
        if (i < this.progress.length) {
          this._progressSubject.next(this.progress[i++]);
        }
      });
  }
}
