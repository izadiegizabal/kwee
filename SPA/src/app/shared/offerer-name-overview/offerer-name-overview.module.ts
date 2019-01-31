import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {OffererNameOverviewComponent} from './offerer-name-overview.component';

@NgModule({
  declarations: [
    OffererNameOverviewComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    OffererNameOverviewComponent
  ]
})
export class OffererNameOverviewModule {
}
