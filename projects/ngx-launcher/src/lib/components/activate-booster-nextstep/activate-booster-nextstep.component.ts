import {
  Component,
  Host,
  ViewEncapsulation
} from '@angular/core';

import { LauncherComponent } from '../../launcher.component';
import { DependencyCheck } from '../../model/dependency-check.model';
import { Projectile } from '../../model/projectile.model';
import { TargetEnvironmentSelection } from '../../model/target-environment.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-activatebooster-nextstep',
  templateUrl: './activate-booster-nextstep.component.html',
  styleUrls: ['./activate-booster-nextstep.component.less']
})
export class ActivateBoosterNextstepComponent {

  constructor(@Host() public launcherComponent: LauncherComponent,
      private projectile: Projectile<TargetEnvironmentSelection>) {
  }

  get dependencyCheck(): DependencyCheck {
    return this.projectile.sharedState.state;
  }
}
