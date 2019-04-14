import {NgModule} from '@angular/core';
import {BusinessProfileComponent} from './business-profile.component';
import {SharedModule} from '../../shared/shared.module';
import {BusinessProfileRoutingModule} from './business-profile-routing.module';
import {OffererNameOverviewModule} from '../../shared/offerer-name-overview/offerer-name-overview.module';
import {BusinessMoreInfoComponent} from './business-more-info/business-more-info.component';
import {BusinessProfileOpinionsComponent} from './business-profile-opinions/business-profile-opinions.component';
import {NgxMapboxGLModule} from 'ngx-mapbox-gl';
import {environment} from '../../../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {ProfilesEffects} from '../store/profiles.effects';
import {StoreModule} from '@ngrx/store';
import {profilesReducer} from '../store/profiles.reducers';
import { BusinessOpenOffersComponent } from './business-open-offers/business-open-offers.component';
import {OfferPreviewCardModule} from '../../offer/offer-preview-card/offer-preview-card.module';

@NgModule({
  declarations: [
    BusinessProfileComponent,
    BusinessMoreInfoComponent,
    BusinessProfileOpinionsComponent,
    BusinessOpenOffersComponent,
  ],
  imports: [
    SharedModule,
    BusinessProfileRoutingModule,
    OffererNameOverviewModule,
    OfferPreviewCardModule,
    EffectsModule.forFeature([ProfilesEffects]),
    StoreModule.forFeature('profiles', profilesReducer),
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapboxAPIKey,
    }),
    OfferPreviewCardModule,
  ]
})
export class BusinessProfileModule {

}
