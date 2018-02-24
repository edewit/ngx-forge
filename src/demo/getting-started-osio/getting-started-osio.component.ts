import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'getting-started-osio',
  styleUrls: ['./getting-started-osio.component.less'],
  templateUrl: './getting-started-osio.component.html'
})
export class GettingStartedOsioComponent implements OnInit {
  appName: string = '';

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  routeToCreateApp(): void {
    this.router.navigate(['/', 'createapp', this.appName]);
  }

  routeToImportApp(): void {
    this.router.navigate(['/', 'importapp', this.appName]);
  }
}
