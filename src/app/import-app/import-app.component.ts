import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'import-app',
  templateUrl: './import-app.component.html'
})
export class ImportAppComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['/', 'osio']);
  }

  complete(): void {
    this.router.navigate(['/']);
  }

  addQuery() {
    const query = '{\"application\":[\"' + this.route.snapshot.params['projectName'] + '\"]}';
    return {
      q: query
    };
  }
}
