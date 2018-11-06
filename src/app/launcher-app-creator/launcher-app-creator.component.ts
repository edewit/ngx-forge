import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'launcher-app-creator',
  templateUrl: './launcher-app-creator.component.html'
})
export class LauncherAppCreatorComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/', 'launcherappcreator']);
  }

  complete(): void {
    this.router.navigate(['/']);
  }
}
