import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessagesComponent} from './messages.component';


const messagesRoutes: Routes = [
  {
    path: ':id', component: MessagesComponent
  },
  {
    path: '', component: MessagesComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(messagesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class MessagesRoutingModule {

}
