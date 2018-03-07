import {
  Component,
  Host,
  Input,
  OnInit
} from '@angular/core';

import { LauncherComponent } from '../launcher.component';

@Component({
  selector: 'f8launcher-cancel-overlay',
  templateUrl: './cancel-overlay.component.html',
  styleUrls: ['./cancel-overlay.component.less']
})
export class CancelOverlayComponent implements OnInit {

  constructor(@Host() public launcherComponent: LauncherComponent) {
  }

  ngOnInit(): void {
  }

  /**
   * Cancel aborted
   */
  cancelAborted(): void {
    this.launcherComponent.cancelAborted();
  }

  /**
   * Cancel confirmed
   */
  cancelConfirmed(): void {
    this.launcherComponent.cancelConfirmed();
  }
}
