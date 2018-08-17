import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fab-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.less']
})
export class ToastNotificationComponent {

  @Input() notifications: any;

  closeToastNotification(notification: any) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

 }
