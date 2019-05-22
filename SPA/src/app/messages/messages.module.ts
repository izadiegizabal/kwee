import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MessagesComponent} from './messages.component';
import {MessagesRoutingModule} from './messages-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {messageReducer} from './store/message.reducers';
import {EffectsModule} from '@ngrx/effects';
import {MessageEffects} from './store/message.effects';
import {StoreModule} from '@ngrx/store';
import {MiniOfferModule} from '../kwee-live/mini-offer/mini-offer.module';


@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    MessagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('messages', messageReducer),
    EffectsModule.forFeature([MessageEffects]),
    MiniOfferModule
  ],
  exports: [
    MessagesComponent
  ]
})
export class MessagesModule {

}
