import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OfferCreateComponent} from './offer-create.component';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';
import {AlertDialogModule} from '../../shared/alert-dialog/alert-dialog.module';

const OfferRoutes: Routes = [
  {path: '', component: OfferCreateComponent},
  {path: ':id/edit', component: OfferCreateComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(OfferRoutes),
    AlertDialogModule
  ],
  exports: [
    RouterModule
  ],
  entryComponents: [
    AlertDialogComponent,
  ],
})
export class OfferRoutingModule {

}
