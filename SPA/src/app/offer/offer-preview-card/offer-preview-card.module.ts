import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {OfferPreviewCardComponent} from './offer-preview-card.component';
import {IconWithTextModule} from '../../shared/icon-with-text/icon-with-text.module';
import {OffererNameOverviewModule} from '../../shared/offerer-name-overview/offerer-name-overview.module';
import {RouterModule} from '@angular/router';
import {SnsShareModule} from '../../shared/sns-share/sns-share.module';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';
import {MatChipsModule} from '@angular/material/chips';
import {EffectsModule} from '@ngrx/effects';
import {OfferManageEffects} from '../offer-manage/store/offer-manage.effects';

@NgModule({
  declarations: [
    OfferPreviewCardComponent,
    AlertDialogComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    IconWithTextModule,
    MatChipsModule,
    OffererNameOverviewModule,
    SnsShareModule,
    EffectsModule.forFeature([OfferManageEffects])
  ],
  entryComponents: [
    AlertDialogComponent
  ],
  exports: [
    OfferPreviewCardComponent
  ]
})
export class OfferPreviewCardModule {

}
