import {NgModule} from '@angular/core';
import {MaterialAngularModule} from './material-angular.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    MaterialAngularModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    MaterialAngularModule,
    FlexLayoutModule
  ]
})
export class SharedModule {

}
