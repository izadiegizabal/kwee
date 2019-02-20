import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactSupportComponent} from './contact-support.component';

const contactsupportRoutes: Routes = [
  {
    path: '', component: ContactSupportComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(contactsupportRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class ContactSupportRoutingModule {
}
