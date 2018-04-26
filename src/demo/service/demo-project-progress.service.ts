import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription, Subject } from 'rxjs';

import { Progress } from '../../app/launcher/launcher.module';
import { ProjectProgressService } from '../../app/launcher/launcher.module';
import { HelperService } from '../../app/launcher/service/helper.service';
import { TokenProvider } from '../../app/service/token-provider';

@Injectable()
export class DemoProjectProgressService implements ProjectProgressService {
  private progress: Progress[];
  private _progressSubject: Subject<Progress[]> = new Subject();
  private timer: Subscription;

  getProgress(): WebSocket {
    this.initTimer(); // Timer to simulate progress
    const socket = new WebSocket('wss://echo.websocket.org');
    this._progressSubject.subscribe(item => {
      socket.onmessage({data: JSON.stringify(item)} as MessageEvent);
    });
    return socket;
  }

  // Private
  private getItems(): Progress[] {
    if (this.progress === undefined) {
      this.progress = [{
        'completed': false,
        'description': 'Creating New GitHub Repository',
        'hypertext': 'View New Repository',
        'inProgress': false,
        'url': 'https://github.com/fabric8-launcher/ngx-launcher'
      }, {
        'completed': false,
        'description': 'Pushing Customized Booster Code into the Repository',
        'inProgress': false
      }, {
        'completed': false,
        'description': 'Creating Your Project on the OpenShift Cloud',
        'inProgress': false,
        'hypertext': 'View New Application',
        'url': 'https://github.com/fabric8-launcher/ngx-launcher'
      }, {
        'completed': false,
        'description': 'Setting up Build Pipeline',
        'inProgress': false
      }, {
        'completed': false,
        'description': 'Configure Trigger Builds on Git Pushes',
        'inProgress': false
      }] as Progress[];
    }
    return this.progress;
  }

  // Timer to simulate progress
  private initTimer(): void {
    if (this.timer !== undefined) {
      this.timer.unsubscribe();
    }
    this.timer = Observable
      .timer(0, 2500) // timer(firstValueDelay, intervalBetweenValues)
      .do(() => {
        let items = this.getItems();
        for (let i = 0; i < items.length; i++) {
          if (items[i].inProgress === true) {
            items[i].inProgress = false;
            items[i].completed = true;
          } else if (items[i].completed === true) {
            items[i].inProgress = false;
          } else if (items[i].completed === false) {
            items[i].inProgress = true;
            break;
          }
        }
      })
      .take(6)
      .subscribe(value => {
        this.updateProgressStream();
      });
  }

  private updateProgressStream(): void {
    this._progressSubject.next(this.getItems());
  }
}
