import {NgModule} from '@angular/core';
import {MaterialAngularModule} from './material-angular.module';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [],
  imports: [
    MaterialAngularModule,
    FlexLayoutModule,
  ],
  exports: [
    MaterialAngularModule,
    FlexLayoutModule
  ]
})
export class SharedModule {

}
