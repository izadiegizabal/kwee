import {NgModule} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {SignupinSectionComponent} from './header/signupin-section/signupin-section.component';
import {FooterComponent} from './footer/footer.component';
import {SharedModule} from '../shared/shared.module';
import {AppRoutingModule} from '../app-routing.module';
import {UserMenuComponent} from './header/user-menu/user-menu.component';
import {NgxPayPalModule} from 'ngx-paypal';

@NgModule({
  declarations: [
    HeaderComponent,
    SignupinSectionComponent,
    UserMenuComponent,
    FooterComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    NgxPayPalModule,
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class CoreModule {

}
