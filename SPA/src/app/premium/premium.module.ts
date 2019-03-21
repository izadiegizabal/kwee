import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {PremiumComponent} from './premium.component';
import {PremiumRoutingModule} from './premium-routing.module';
import { PremiumCandidateComponent } from './premium-candidate/premium-candidate.component';
import { PremiumBusinessComponent } from './premium-business/premium-business.component';
import { PaypalDialogComponent } from './paypal-dialog/paypal-dialog.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {PaypalDialogModule} from './paypal-dialog/paypal-dialog.module';

@NgModule({
  declarations: [
    PremiumComponent,
    PremiumCandidateComponent,
    PremiumBusinessComponent,
  ],
  imports: [
    SharedModule,
    PremiumRoutingModule,
    NgxPayPalModule,
    PaypalDialogModule,
  ],
  exports: [
  ],
  entryComponents: [
    PaypalDialogComponent,
  ],
})
export class PremiumModule {

}
