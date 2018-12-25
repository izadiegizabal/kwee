import {NgModule} from '@angular/core';
import {SigninComponent} from './signin.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SigninRoutingModule} from './signin-routing.module';
import {StoreModule} from '@ngrx/store';
import {authReducer} from '../store/auth.reducers';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from '../store/auth.effects';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    SigninComponent,
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature('auth', authReducer),
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class SigninModule {

}
