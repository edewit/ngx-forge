import {
  Component,
  Host,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Progress } from '../../model/progress.model';
import { ProjectProgressService } from '../../service/project-progress.service';
import { LauncherComponent } from '../../launcher.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectprogress-createapp-nextstep',
  templateUrl: './project-progress-createapp-nextstep.component.html',
  styleUrls: ['./project-progress-createapp-nextstep.component.less']
})
export class ProjectProgressCreateappNextstepComponent implements OnInit, OnChanges, OnDestroy {
  @Input() statusLink: string;
  isError = false;
  errorMessage = '';
  private _progress: Progress[];
  private socket: WebSocket;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private projectProgressService: ProjectProgressService) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const statusLink = changes['statusLink']['currentValue'];
    if (statusLink) {
      this.socket = this.projectProgressService.getProgress(statusLink);
      this.socket.onmessage = (event: MessageEvent) => {
        if (!this._progress) {
          this._progress = [];
          let values = JSON.parse(event.data);
          console.log('data from Create ws', values);
          for (let item of values) {
            for (let key in item) {
              if (item.hasOwnProperty(key)) {
                let status = new Progress(false, item[key], '', true, key);
                this._progress.push(status);
              }
            }
          }
        } else {
          let message = JSON.parse(event.data);
          console.log('data from ws', message);
          let data = message.data || {};
          if (data && data.error) {
            console.log(message.data.error);
            this.isError = true;
            this.errorMessage = data.error;
          } else {
            for (let status of this._progress) {
              if (status.key === message.statusMessage) {
                status.completed = true;
                if (data.location != null) {
                  status.hyperText = data.location;
                }
                break;
              }
            }
          }
        }
      };
      this.socket.onerror = (error: ErrorEvent) => {
        console.log('error in fetching messages in progress Component: Create', error);
      };
      this.socket.onclose = () => {
        console.log('closed the socket call in progress component in Create');
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
    if (result) {
      this.socket.close();
    }
    return result;
  }

  getProgressByKey(key: string): Progress {
    for (let status of this._progress) {
      if (status.key === key) {
        return status;
      }
    }
    return null;
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
