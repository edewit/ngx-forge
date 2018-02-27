import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DependencyCheckService } from '../../app/launcher/service/dependency-check.service';

@Component({
  selector: 'getting-started-osio',
  styleUrls: ['./getting-started-osio.component.less'],
  templateUrl: './getting-started-osio.component.html'
})
export class GettingStartedOsioComponent implements OnInit {
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

  routeToCreateApp(): void {
    this.router.navigate(['/', 'createapp', this.projectName]);
  }

  routeToImportApp(): void {
    this.router.navigate(['/', 'importapp', this.projectName]);
  }
}
