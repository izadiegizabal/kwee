import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {UserPreviewCardComponent} from './user-preview-card.component';
import {IconWithTextModule} from '../../shared/icon-with-text/icon-with-text.module';
import {OffererNameOverviewModule} from '../../shared/offerer-name-overview/offerer-name-overview.module';
import {RouterModule} from '@angular/router';
import {SnsShareModule} from '../../shared/sns-share/sns-share.module';

@NgModule({
  declarations: [
    UserPreviewCardComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    IconWithTextModule,
    OffererNameOverviewModule,
    SnsShareModule
  ],
  exports: [
    UserPreviewCardComponent
  ]
})
export class UserPreviewCardModule {

}
