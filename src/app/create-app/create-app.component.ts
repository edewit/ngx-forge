import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';
import { DependencyCheck } from '../../../projects/ngx-launcher/src/lib/model/dependency-check.model';
import { Projectile } from '../../../projects/ngx-launcher/src/lib/model/projectile.model';

@Component({
  selector: 'create-app',
  templateUrl: './create-app.component.html'
})
export class CreateAppComponent implements OnInit {
  depEditorFlag = true;
  codebaseId: string;
  constructor(private router: Router, projectile: Projectile<DependencyCheck>) {
    this.codebaseId = projectile.sharedState.state.codebaseId;
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
