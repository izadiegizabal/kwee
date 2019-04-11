import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {OffererNameOverviewComponent} from './offerer-name-overview.component';
import {ClickOutsideModule} from 'ng-click-outside';

@NgModule({
  declarations: [
    OffererNameOverviewComponent
  ],
  imports: [
    SharedModule,
    ClickOutsideModule
  ],
  exports: [
    OffererNameOverviewComponent
  ]
})
export class OffererNameOverviewModule {
}
