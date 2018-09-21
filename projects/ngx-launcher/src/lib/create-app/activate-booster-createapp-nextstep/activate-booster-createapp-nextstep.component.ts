import {
  Component,
  Host,
  ViewEncapsulation
} from '@angular/core';

import { LauncherComponent } from '../../launcher.component';
import { Projectile } from '../../model/summary.model';
import { DependencyCheck } from '../../model/dependency-check.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-activatebooster-createapp-nextstep',
  templateUrl: './activate-booster-createapp-nextstep.component.html',
  styleUrls: ['./activate-booster-createapp-nextstep.component.less']
})
export class ActivateBoosterCreateappNextstepComponent {

  constructor(@Host() public launcherComponent: LauncherComponent,
      private projectile: Projectile<DependencyCheck>) {
  }

  get data(): DependencyCheck {
    return this.projectile.getState('TargetEnvironment').state;
  }
}
