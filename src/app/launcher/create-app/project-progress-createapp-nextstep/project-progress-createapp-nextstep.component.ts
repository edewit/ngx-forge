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
import { Broadcaster } from 'ngx-base';

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
    private projectSummaryService: ProjectSummaryService,
    private broadcaster: Broadcaster) {
      this.broadcaster.on('progressEvents').subscribe((events: Progress[]) => {
        console.log('got the event list', events);
        this._progress = events;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const statusLink = changes['statusLink']['currentValue'];
    if (statusLink) {
      this.socket = this.projectProgressService.getProgress(statusLink);
      this.socket.onmessage = (event: MessageEvent) => {
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
            if (status.name === message.statusMessage) {
              status.completed = true;
              if (data.location != null) {
                status.hyperText = data.location;
              }
              break;
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
      this.launcherComponent.summary, failedStep).subscribe(result => {
        this._progress = null;
        this.errorMessage = null;
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
