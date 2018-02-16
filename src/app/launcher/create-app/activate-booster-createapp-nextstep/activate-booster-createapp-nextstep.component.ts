import {
  Component,
  Host,
  ViewEncapsulation
} from '@angular/core';
import { LauncherComponent } from '../../launcher.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-activatebooster-createapp-nextstep',
  templateUrl: './activate-booster-createapp-nextstep.component.html',
  styleUrls: ['./activate-booster-createapp-nextstep.component.less']
})
export class ActivateBoosterCreateappNextstepComponent {

  constructor(@Host() public launcherComponent: LauncherComponent) {
  }
}
