import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'getting-started',
  styleUrls: ['./getting-started.component.less'],
  templateUrl: './getting-started.component.html'
})
export class GettingStartedComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    // Todo: Add broadcaster in fabric8-ui to close global overlay
    // this.broadcaster.broadcast('showGettingStarted', false);
  }

  routeToCreateApp(): void {
    this.router.navigate(['/_createapp']);
    this.cancel();
  }

  routeToImportApp(): void {
    this.router.navigate(['/_importapp']);
    this.cancel();
  }
}
