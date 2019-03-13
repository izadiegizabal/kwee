import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {BusinessPreviewCardComponent} from './business-preview-card.component';
import {IconWithTextModule} from '../../../shared/icon-with-text/icon-with-text.module';
import {OffererNameOverviewModule} from '../../../shared/offerer-name-overview/offerer-name-overview.module';
import {RouterModule} from '@angular/router';
import {SnsShareModule} from '../../../shared/sns-share/sns-share.module';

@NgModule({
  declarations: [
    BusinessPreviewCardComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    IconWithTextModule,
    OffererNameOverviewModule,
    SnsShareModule
  ],
  exports: [
    BusinessPreviewCardComponent
  ]
})
export class BusinessPreviewCardModule {

}
