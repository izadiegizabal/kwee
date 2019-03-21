import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {NotificationsComponent} from './notifications.component';
import {NotificationsRoutingModule} from './notifications-routing.module';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    NotificationsRoutingModule
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule {

}
