import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {CandidateHomeComponent} from './candidate-home/candidate-home.component';

const routes: Routes = [
  {path: '', redirectTo: '/candidate-home', pathMatch: 'full'},
  {path: 'candidate-home', component: CandidateHomeComponent},
  {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
  {path: 'signup', loadChildren: './auth/signup/signup.module#SignupModule'},
  {path: 'signin', loadChildren: './auth/signin/signin.module#SigninModule'},
  {path: '**', redirectTo: '/candidate-home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
