import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'import-app',
  templateUrl: './import-app.component.html'
})
export class ImportAppComponent implements OnInit {
  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
