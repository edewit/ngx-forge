import {
  Component,
  Host,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Progress } from '../../model/progress.model';
import { ProjectProgressService } from '../../service/project-progress.service';
import { LauncherComponent } from '../../launcher.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-projectprogress-createapp-nextstep',
  templateUrl: './project-progress-createapp-nextstep.component.html',
  styleUrls: ['./project-progress-createapp-nextstep.component.less']
})
export class ProjectProgressCreateappNextstepComponent implements OnInit, OnDestroy {
  private _progress: Progress[];
  private subscriptions: Subscription[] = [];

  constructor(@Host() public launcherComponent: LauncherComponent,
              private projectProgressService: ProjectProgressService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.projectProgressService.getProgress().subscribe((progress) => {
      this._progress = progress;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
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
}
