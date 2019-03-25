import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MessagesComponent} from './messages.component';
import {MessagesRoutingModule} from './messages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    MessagesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MessagesComponent
  ]
})
export class MessagesModule {

}