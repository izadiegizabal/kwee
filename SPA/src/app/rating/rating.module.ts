import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';
import {RateCandidateComponent} from './rate-candidate/rate-candidate.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    RateCandidateComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MatExpansionModule,
    StarRatingModule.forRoot()
  ],
  entryComponents: [
    RateCandidateComponent
  ],
  exports: [
    RateCandidateComponent
  ]
})
export class RatingModule {

}
