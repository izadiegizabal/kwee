import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {OfferCreateComponent} from './offer-create.component';
import {OfferRoutingModule} from './offer-routing.module';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {OkDialogComponent} from '../../shared/ok-dialog/ok-dialog.component';
import {OkDialogModule} from '../../shared/ok-dialog/ok-dialog.module';
import {SignupModule} from '../../auth/signup/signup.module';
import {DialogErrorComponent} from '../../auth/signup/dialog-error/dialog-error.component';

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
    OkDialogModule,
    SignupModule
  ],
  entryComponents: [
    OkDialogComponent,
    DialogErrorComponent
  ],
  exports: [
    OfferCreateComponent
  ]
})
export class OfferCreateModule {
}
