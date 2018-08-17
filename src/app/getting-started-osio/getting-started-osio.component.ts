import {
  Component, OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DependencyCheckService } from '../../../projects/ngx-launcher/src/lib/service/dependency-check.service';


@Component({
  selector: 'getting-started-osio',
  styleUrls: ['./getting-started-osio.component.less'],
  templateUrl: './getting-started-osio.component.html'
})
export class GettingStartedOsioComponent implements OnInit, OnDestroy {
  projectName: string = '';
  selectedFlow: string = '';
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

  /**
   * Helper to update launcher selection
   */
  updateLauncherFlowSelection(selLaunch: string): void {
    this.selectedFlow = selLaunch;
  }

  /**
   * Helper to route to create/import app
   */
  routeToLaunchApp(): void {
    this.router.navigate(['/', this.selectedFlow, this.projectName]);
  }

  routeToCreateApp(): void {
    this.router.navigate(['/', 'createapp', this.projectName]);
  }

  routeToImportApp(): void {
    this.router.navigate(['/', 'importapp', this.projectName]);
  }
}
