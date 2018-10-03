import {
  Component,
  Host,
  ViewEncapsulation
} from '@angular/core';

import { LauncherComponent } from '../../launcher.component';
import { Projectile } from '../../model/projectile.model';
import { DependencyCheck } from '../../model/dependency-check.model';
import { TargetEnvironmentSelection } from '../../model/target-environment.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8launcher-activatebooster-createapp-nextstep',
  templateUrl: './activate-booster-createapp-nextstep.component.html',
  styleUrls: ['./activate-booster-createapp-nextstep.component.less']
})
export class ActivateBoosterCreateappNextstepComponent {

  constructor(@Host() public launcherComponent: LauncherComponent,
      private projectile: Projectile<TargetEnvironmentSelection>) {
  }

  get dependencyCheck(): DependencyCheck {
    return this.projectile.sharedState.state;
  }
}
