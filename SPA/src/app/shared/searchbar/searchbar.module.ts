import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {SearchbarComponent} from './searchbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    SearchbarComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SearchbarComponent
  ]
})
export class SearchbarModule {
}
