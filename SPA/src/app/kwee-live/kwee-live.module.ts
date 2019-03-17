import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {KweeLiveComponent} from './kwee-live.component';
import {KweeLiveRoutingModule} from './kwee-live-routing.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    KweeLiveComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    KweeLiveRoutingModule,
    MatProgressSpinnerModule
  ],
  exports: [
    KweeLiveComponent
  ]
})
export class KweeLiveModule {

}
