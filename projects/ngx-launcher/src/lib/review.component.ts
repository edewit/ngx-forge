import { Input, OnInit } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { Projectile } from './model/projectile.model';

export class ReviewComponent implements OnInit {
  @Input()
  stepId: string;
  data: any;

  constructor(private broadcaster: Broadcaster, private projectile: Projectile<any>) {}

  ngOnInit(): void {
    this.data = this.projectile.getState(this.stepId).state;
  }

  navToStep(id: string) {
    this.broadcaster.broadcast('navigate-to', id);
  }
}
