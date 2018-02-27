import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'launcher-app',
  templateUrl: './launcher-app.component.html'
})
export class LauncherAppComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/', 'launcher']);
  }

  complete(): void {
    this.router.navigate(['/']);
  }
}
