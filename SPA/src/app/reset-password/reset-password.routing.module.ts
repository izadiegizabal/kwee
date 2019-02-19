import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ResetPasswordComponent} from './reset-password.component';

const resetPassword: Routes = [
  {
    path: '', component: ResetPasswordComponent, children: [
      {path: ':token', component: ResetPasswordComponent}
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(resetPassword)
  ],
  exports: [
    RouterModule
  ]
})
export class ResetPasswordRoutingModule {

}
