import { Component, Host, Input, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { Progress } from '../../model/progress.model';
import { ProjectProgressService } from '../../service/project-progress.service';
import { LauncherComponent } from '../../launcher.component';
import { Broadcaster } from 'ngx-base';
import { Router } from '@angular/router';
import { broadcast } from '../../shared/telemetry.decorator';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectprogress-importapp-nextstep',
  templateUrl: './project-progress-importapp-nextstep.component.html',
  styleUrls: ['./project-progress-importapp-nextstep.component.less']
})
export class ProjectProgressImportappNextstepComponent implements OnChanges, OnDestroy {
  @Input() statusLink: string;
  errorMessage = '';
  private _progress: Progress[];
  private socket: WebSocket;

  constructor(@Host() public launcherComponent: LauncherComponent,
              private broadcaster: Broadcaster,
              private projectProgressService: ProjectProgressService,
              private router: Router) {
    this.broadcaster.on('progressEvents').subscribe((events: Progress[]) => this._progress = events);
  }

  ngOnChanges(changes: SimpleChanges) {
    const statusLink = changes['statusLink']['currentValue'];
    if (statusLink) {
      this.socket = this.projectProgressService.getProgress(statusLink);
      this.socket.onmessage = this.handleMessage;
      this.socket.onerror = (error: ErrorEvent) => {
        console.log('error in fetching messages in progress Component: Import', error);
      };
      this.socket.onclose = () => {
        console.log('socket call closed in progress component in Import');
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
    this.closeConnections();
  }

  addQuery() {
    const query = '{\"application\":[\"' + this.launcherComponent.currentSelection.projectName + '\"]}';
    return {
      q: query
    };
  }

  @broadcast('ImportFlowViewPipelineButtonClicked', {})
  viewPipeline() {}

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

  get isError(): boolean {
    return !!this.errorMessage;
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
    this.errorMessage = '';
  }
}
