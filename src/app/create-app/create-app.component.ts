import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'create-app',
  templateUrl: './create-app.component.html'
})
export class CreateAppComponent implements OnInit {
  depEditorFlag = true;
  codeBaseCreated = true;
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

  createWorkSpace() {
    window.open('http://che.openshift.io', '_blank');
  }
}
