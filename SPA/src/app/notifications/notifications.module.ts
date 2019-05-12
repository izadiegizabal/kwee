import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {NotificationsComponent} from './notifications.component';
import {NotificationsRoutingModule} from './notifications-routing.module';
import {StoreModule} from '@ngrx/store';
import {messageReducer} from '../messages/store/message.reducers';
import {EffectsModule} from '@ngrx/effects';
import {MessageEffects} from '../messages/store/message.effects';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    NotificationsRoutingModule,
    StoreModule.forFeature('messages', messageReducer),
    EffectsModule.forFeature([MessageEffects])
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule {

}
