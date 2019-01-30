import {ExperienceFormsComponent} from './experience-forms.component';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    ExperienceFormsComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    ExperienceFormsComponent
  ]
})
export class ExperienceFormsModule {
}
