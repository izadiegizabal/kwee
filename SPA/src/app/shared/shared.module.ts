import {NgModule} from '@angular/core';
import {OffererNameOverviewComponent} from './offerer-name-overview/offerer-name-overview.component';
import {IconWithTextComponent} from './icon-with-text/icon-with-text.component';
import {MaterialAngularModule} from './material-angular.module';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    IconWithTextComponent,
    OffererNameOverviewComponent,
  ],
  imports: [
    MaterialAngularModule,
    FlexLayoutModule,
  ],
  exports: [
    MaterialAngularModule,
    FlexLayoutModule,
    IconWithTextComponent,
    OffererNameOverviewComponent,
  ]
})
export class SharedModule {

}
