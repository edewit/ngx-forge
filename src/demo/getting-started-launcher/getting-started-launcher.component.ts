import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DependencyCheckService } from '../../app/launcher/service/dependency-check.service';

@Component({
  selector: 'getting-started-launcher',
  styleUrls: ['./getting-started-launcher.component.less'],
  templateUrl: './getting-started-launcher.component.html'
})
export class GettingStartedLauncherComponent implements OnInit {
  projectName: string = '';

  private subscriptions: Subscription[] = [];

  constructor(private dependencyCheckService: DependencyCheckService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.dependencyCheckService.getDependencyCheck().subscribe((val) => {
      this.projectName = val.projectName;
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  routeToLauncherApp(): void {
    this.router.navigate(['/', 'launcherapp', this.projectName]);
  }
}
