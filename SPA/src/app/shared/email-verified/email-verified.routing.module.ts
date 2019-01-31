import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {EmailVerifiedComponent} from './email-verified.component';

const emailVerified: Routes = [
  {
    path: '', component: EmailVerifiedComponent, children: [
      {path: ':token', component: EmailVerifiedComponent}
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(emailVerified)
  ],
  exports: [
    RouterModule
  ]
})
export class EmailVerifiedRoutingModule {

}
