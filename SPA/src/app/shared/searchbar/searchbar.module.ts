import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {SearchbarComponent} from './searchbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { OrderbyButtonComponent } from './orderby-button/orderby-button.component';

@NgModule({
  declarations: [
    SearchbarComponent,
    OrderbyButtonComponent
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
