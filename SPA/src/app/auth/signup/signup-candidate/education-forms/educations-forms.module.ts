import {NgModule} from '@angular/core';
import {EducationFormsComponent} from './education-forms.component';
import {SharedModule} from '../../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    EducationFormsComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    EducationFormsComponent
  ]
})
export class EducationsFormsModule {
}
