import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  routeToLauncher(): void {
    this.router.navigate(['/', 'launcher']);
  }

  routeToOsio(): void {
    this.router.navigate(['/', 'osio']);
  }
}
