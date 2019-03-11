import {NgModule} from '@angular/core';
import {FiltersCandidateComponent} from './filters-candidate.component';
import {SharedModule} from '../../shared.module';
import {ReactiveFormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    FiltersCandidateComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [
    FiltersCandidateComponent
  ]
})
export class FiltersCandidateModule {
}
