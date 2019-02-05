import {NgModule} from '@angular/core';
import {BusinessProfileComponent} from './business-profile.component';
import {SharedModule} from '../../shared.module';
import {BusinessProfileRoutingModule} from './business-profile-routing.module';
import {OffererNameOverviewModule} from '../../offerer-name-overview/offerer-name-overview.module';

@NgModule({
  declarations: [
    BusinessProfileComponent,
  ],
  imports: [
    SharedModule,
    BusinessProfileRoutingModule,
    OffererNameOverviewModule
  ]
})
export class BusinessProfileModule {

}
