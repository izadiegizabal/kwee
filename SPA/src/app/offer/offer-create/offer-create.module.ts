import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {OfferCreateComponent} from './offer-create.component';
import {OfferRoutingModule} from './offer-routing.module';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    OfferCreateComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    CKEditorModule,
    ReactiveFormsModule,
    OfferRoutingModule,
  ],
  exports: [
    OfferCreateComponent
  ]
})
export class OfferCreateModule {
}
