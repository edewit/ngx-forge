import { Injectable } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { ProjectProgressService } from '../../../projects/ngx-launcher/src/lib/service/project-progress.service';

const PROGRESS_ERROR = [
  {
    statusMessage: 'GITHUB_CREATE',
    data: {
      location: 'https://github.com/fabric8-launcher/launcher-backend'
    }
  },
  { statusMessage: 'GITHUB_PUSHED' },
  {
    statusMessage: 'OPENSHIFT_CREATE',
    data: {
      error: 'Failed to create the Openshift application'
    }
  }
];

const PROGRESS_RETRY = [
  {
    statusMessage: 'OPENSHIFT_CREATE',
    data: {
      location: 'https://console.starter-us-east-2.openshift.com/console/projects'
    }
  },
  { statusMessage: 'OPENSHIFT_PIPELINE' },
  { statusMessage: 'GITHUB_WEBHOOK' }
];


@Injectable()
export class DemoProjectProgressService implements ProjectProgressService {

  private progress: any[];
  private _progressSubject: Subject<any[]>;
  private timer: Subscription;

  getProgress(link: string): WebSocket {
    this._progressSubject = new Subject();
    this.progress = link.indexOf('retry') >= 0 || link.indexOf('import') >= 0 ? PROGRESS_RETRY : PROGRESS_ERROR;
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
    this.timer = timer(0, 2500) // timer(firstValueDelay, intervalBetweenValues)
      .subscribe(value => {
        if (i < this.progress.length) {
          this._progressSubject.next(this.progress[i++]);
        }
      });
  }
}
