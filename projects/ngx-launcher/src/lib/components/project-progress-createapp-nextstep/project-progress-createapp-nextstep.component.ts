import { Component, Host, Input, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation, Optional } from '@angular/core';

import { Progress } from '../../model/progress.model';
import { ProjectProgressService } from '../../service/project-progress.service';
import { LauncherComponent } from '../../launcher.component';
import { ProjectSummaryService } from '../../service/project-summary.service';
import { Broadcaster } from 'ngx-base';
import { Projectile } from '../../model/summary.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectprogress-createapp-nextstep',
  templateUrl: './project-progress-createapp-nextstep.component.html',
  styleUrls: ['./project-progress-createapp-nextstep.component.less']
})
export class ProjectProgressCreateappNextstepComponent implements OnChanges, OnDestroy {
  @Input() gettingStartedInfo: boolean;
  @Input() statusLink: string;
  errorMessage: string;
  private _progress: Progress[];
  private socket: WebSocket;

  constructor(@Host() @Optional() public launcherComponent: LauncherComponent,
    private projectProgressService: ProjectProgressService,
    private projectSummaryService: ProjectSummaryService,
    private projectile: Projectile<any>,
    broadcaster: Broadcaster) {
      broadcaster.on<Progress[]>('progressEvents').subscribe(events => {
        console.log('got the event list', events);
        this._progress = events;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const statusLink = changes['statusLink']['currentValue'];
    if (statusLink) {
      this.socket = this.projectProgressService.getProgress(statusLink);
      this.socket.onmessage = this.handleMessage;
      this.socket.onerror = (error: ErrorEvent) => {
        console.log('error in fetching messages in progress Component: Create', error);
      };
      this.socket.onclose = () => {
        console.log('closed the socket call in progress component in Create');
      };
    }
  }

  private handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log('data from ws', message);
      const data = message.data || {};
      if (data && data.error) {
        console.log(message.data.error);
        this.errorMessage = data.error;
        for (const step of this._progress.filter((s) => !s.completed)) {
          step.error = true;
        }
        this.socket.close();
        return;
      }
      const status = this._progress.find((p) => p.name === message.statusMessage);
      if (status) {
        status.completed = true;
        if (data.location != null) {
          status.hyperText = data.location;
        }
      }
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private get lastCompleted(): number {
    return this._progress ? this._progress.findIndex(item => !item.completed) : -1;
  }

  retry() {
    const failedStep = this.lastCompleted;
    this.projectSummaryService.setup(
      this.projectile, failedStep).subscribe(val => {
        this.errorMessage = null;
        if (!val || !val['uuid_link']) {
          this.errorMessage = 'Invalid response from server!';
        }
        for (const step of this._progress.filter((s) => !s.completed)) {
          step.error = false;
        }
        this.launcherComponent.statusLink = val['uuid_link'];
      });
  }

  // Accessors

  get allCompleted(): boolean {
    return this._progress ? !this._progress.find(item => !item.completed) : false;
  }

  get isError(): boolean {
    return !!this.errorMessage;
  }

  getProgressByKey(key: string): Progress {
    for (const status of this._progress) {
      if (status.name === key) {
        return status;
      }
    }
    return {} as Progress;
  }

  get progress(): Progress[] {
    return this._progress;
  }

}
