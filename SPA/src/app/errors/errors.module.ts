import {NgModule} from '@angular/core';
import {ErrorPageComponent} from './errorPage.component';
import {SharedModule} from '../shared/shared.module';
import {ErrorsRoutingModule} from './errors-routing.module';

@NgModule({
  declarations: [
    ErrorPageComponent,
  ],
  imports: [
    ErrorsRoutingModule,
    SharedModule
  ],
  exports: []
})
export class ErrorsModule {

}
