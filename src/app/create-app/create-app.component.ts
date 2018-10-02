import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'create-app',
  templateUrl: './create-app.component.html'
})
export class CreateAppComponent implements OnInit {
  depEditorFlag = true;
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/', 'osio']);
  }

  complete(): void {
    this.router.navigate(['/']);
  }
}
