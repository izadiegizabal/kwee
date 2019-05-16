import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  apiUrl = environment.apiUrl;

  @Input() notification: {
    read: boolean,
    status: boolean, // if the notification is positive o negative --> selected + status false = rejected
    notification: string, // type of notification
    from: {
      img: string,
      name: string,
      id: number
    }
  } = {
    read: true,
    status: true,
    notification: 'selected',
    from: {
      img: 'uploads/offerers/1556650179019.png',
      name: 'Facebook',
      id: 428
    }
  };

  constructor() {
  }

  ngOnInit() {
    console.log(this.notification);
  }

}
