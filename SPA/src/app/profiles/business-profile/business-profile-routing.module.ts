import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BusinessProfileComponent} from './business-profile.component';

const businessProfileRoutes: Routes = [
  {
    path: '', component: BusinessProfileComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(businessProfileRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class BusinessProfileRoutingModule {

}
