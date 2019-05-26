import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Offer} from '../../../models/Offer.model';
import {getTimePassed, getUrlfiedString} from '../../shared/utils';
import {months} from 'moment';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  apiUrl = environment.apiUrl;

  @Input() notification: {
    createdAt: string,
    read: boolean,
    status: boolean, // if the notification is positive o negative --> selected + status false = rejected
    notification: string, // type of notification
    from: {
      img: string,
      name: string,
      id: number
    }
    offer: Offer
  };

  constructor() {
  }

  ngOnInit() {
  }

  getUrlfied(title: string) {
    return getUrlfiedString(title);
  }

  getNotiTime(createdAt: string) {
    return getTimePassed(new Date(createdAt), true);
  }
}
