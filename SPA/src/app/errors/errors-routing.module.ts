import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ErrorPageComponent} from './errorPage.component';

const ErrorsRoutes: Routes = [
  {
    path: '', children: [
      {path: ':errorNum', component: ErrorPageComponent},
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ErrorsRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class ErrorsRoutingModule {
}
