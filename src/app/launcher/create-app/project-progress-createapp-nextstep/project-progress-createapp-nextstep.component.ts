import {
  Component,
  Host,
  Input,
  OnDestroy,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';

import { Progress } from '../../model/progress.model';
import { ProjectProgressService } from '../../service/project-progress.service';
import { LauncherComponent } from '../../launcher.component';
import { ProjectSummaryService } from '../../../../..';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectprogress-createapp-nextstep',
  templateUrl: './project-progress-createapp-nextstep.component.html',
  styleUrls: ['./project-progress-createapp-nextstep.component.less']
})
export class ProjectProgressCreateappNextstepComponent implements OnChanges, OnDestroy {
  @Input() statusLink: string;
  errorMessage: string;
  private _progress: Progress[];
  private socket: WebSocket;

  constructor(@Host() public launcherComponent: LauncherComponent,
    private projectProgressService: ProjectProgressService,
    private projectSummaryService: ProjectSummaryService) {
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
                this._progress.push({ key: key, description: item[key] } as Progress);
              }
            }
          }
        } else {
          let message = JSON.parse(event.data);
          console.log('data from ws', message);
          let data = message.data || {};
          if (data && data.error) {
            console.log(message.data.error);
            this.errorMessage = data.error;
            for (let i = this.lastCompleted; i < this._progress.length; i++) {
              this._progress[i].error = true;
            }
            this.socket.close();
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

  completed() {
    this.socket.close();
    this.launcherComponent.completed();
  }

  private get lastCompleted(): number {
    return this._progress ? this._progress.findIndex(item => !item.completed) : -1;
  }

  retry() {
    const failedStep = this.lastCompleted;
    this.projectSummaryService.setup(
      this.launcherComponent.summary, failedStep).subscribe(result => {
        this._progress = null;
        this.ngOnChanges({'statusLink': new SimpleChange('', result.uuid_link, false)});
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
    this.errorMessage = undefined;
  }
}
