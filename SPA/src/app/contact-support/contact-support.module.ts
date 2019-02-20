import {NgModule} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import {ContactSupportComponent} from './contact-support.component';
import {ContactSupportRoutingModule} from './contact-support-routing.module';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ContactSupportComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    ContactSupportRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    ContactSupportComponent
  ]
})

export class ContactSupportModule {}
