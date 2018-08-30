import { Component, Host, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { Progress } from '../../model/progress.model';
import { ProjectProgressService } from '../../service/project-progress.service';
import { LauncherComponent } from '../../launcher.component';
import { Broadcaster } from 'ngx-base';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectprogress-importapp-nextstep',
  templateUrl: './project-progress-importapp-nextstep.component.html',
  styleUrls: ['./project-progress-importapp-nextstep.component.less']
})
export class ProjectProgressImportappNextstepComponent implements OnChanges, OnDestroy {
  @Input() statusLink: string;
  isError = false;
  errorMessage = '';
  private _progress: Progress[];
  private socket: WebSocket;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private broadcaster: Broadcaster,
              private projectProgressService: ProjectProgressService) {
    this.broadcaster.on('progressEvents').subscribe((events: Progress[]) => this._progress = events);
  }

  ngOnChanges(changes: SimpleChanges) {
    const statusLink = changes['statusLink']['currentValue'];
    if (statusLink) {
      this.socket = this.projectProgressService.getProgress(statusLink);
      this.socket.onmessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data);
        const data = message.data || {};
        if (data && data.error) {
          this.isError = true;
          this.errorMessage = data.error;
        } else {
          for (const status of this._progress) {
            if (status.name === message.statusMessage) {
              status.completed = true;
              if (data.location) {
                status.hyperText = data.location;
              }
              break;
            }
          }
        }
      };
      this.socket.onerror = (error: ErrorEvent) => {
        console.log('error in fetching messages in progress Component: Import', error);
      };
      this.socket.onclose = () => {
        console.log('socket call closed in progress component in Import');
      };
    }
  }

  ngOnDestroy() {
    this.closeConnections();
  }

  // Accessors

  get allCompleted(): boolean {
    if (this._progress === undefined) {
      return false;
    }
    let result = true;
    for (let i = 0; i < this._progress.length; i++) {
      if (this._progress[i].completed !== true) {
        result = false;
        break;
      }
    }
    return result;
  }

  get progress(): Progress[] {
    return this._progress;
  }

  private closeConnections() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private reset() {
    this.isError = false;
    this.errorMessage = '';
  }
}
