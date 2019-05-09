import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InvoicesComponent} from './invoices.component';


const InvoicesRoutes: Routes = [
  {
    path: '', component: InvoicesComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(InvoicesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class InvoicesRoutingModule {

}
