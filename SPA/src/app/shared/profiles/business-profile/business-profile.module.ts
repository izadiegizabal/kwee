import {NgModule} from '@angular/core';
import {BusinessProfileComponent} from './business-profile.component';
import {SharedModule} from '../../shared.module';
import {BusinessProfileRoutingModule} from './business-profile-routing.module';
import {OffererNameOverviewModule} from '../../offerer-name-overview/offerer-name-overview.module';
import { BusinessMoreInfoComponent } from './business-more-info/business-more-info.component';
import { BusinessProfileOpinionsComponent } from './business-profile-opinions/business-profile-opinions.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {environment} from '../../../../environments/environment';

@NgModule({
  declarations: [
    BusinessProfileComponent,
    BusinessMoreInfoComponent,
    BusinessProfileOpinionsComponent,
  ],
  imports: [
    SharedModule,
    BusinessProfileRoutingModule,
    OffererNameOverviewModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapboxAPIKey,
    }),
  ]
})
export class BusinessProfileModule {

}
