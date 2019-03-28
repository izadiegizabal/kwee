import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';
import {RateCandidateComponent} from './rate-candidate/rate-candidate.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {OkDialogModule} from '../shared/ok-dialog/ok-dialog.module';
import {SignupModule} from '../auth/signup/signup.module';
import {OkDialogComponent} from '../shared/ok-dialog/ok-dialog.component';
import {DialogErrorComponent} from '../auth/signup/dialog-error/dialog-error.component';


@NgModule({
  declarations: [
    RateCandidateComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MatExpansionModule,
    OkDialogModule,
    SignupModule,
    StarRatingModule.forRoot()
  ],
  entryComponents: [
    RateCandidateComponent,
    OkDialogComponent,
    DialogErrorComponent
  ],
  exports: [
    RateCandidateComponent
  ]
})
export class RatingModule {

}
