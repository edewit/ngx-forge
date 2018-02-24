import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'getting-started-launcher',
  styleUrls: ['./getting-started-launcher.component.less'],
  templateUrl: './getting-started-launcher.component.html'
})
export class GettingStartedLauncherComponent implements OnInit {
  appName: string = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  routeToLauncherApp(): void {
    this.router.navigate(['/', 'launcherapp', this.appName]);
  }
}
