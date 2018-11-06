import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
  constructor(private router: Router) {
  }

  routeToLauncher(): void {
    this.router.navigate(['/', 'launcher']);
  }

  routeToCreator(): void {
    this.router.navigate(['/', 'launcherappcreator']);
  }

  routeToOsio(): void {
    this.router.navigate(['/', 'osio']);
  }
}
