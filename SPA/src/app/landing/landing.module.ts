import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {LandingComponent} from './landing.component';
import {LandingRoutingModule} from './landing.routing.module';
import {SearchbarModule} from '../shared/searchbar/searchbar.module';
import {CoreModule} from '../core/core.module';

@NgModule({
  declarations: [
    LandingComponent
  ],
  imports: [
    SharedModule,
    SearchbarModule,
    CoreModule,
    LandingRoutingModule
  ],
  exports: [
    LandingComponent
  ]
})
export class LandingModule {
}
