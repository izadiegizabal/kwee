import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {BsAccountSettingsComponent} from './business-settings/bs-account-settings/bs-account-settings.component';
import {BsProfileSettingsComponent} from './business-settings/bs-profile-settings/bs-profile-settings.component';
import {CaAccountSettingsComponent} from './candidate-settings/ca-account-settings/ca-account-settings.component';
import {CaProfileSettingsComponent} from './candidate-settings/ca-profile-settings/ca-profile-settings.component';

const settingsRoutes: Routes = [
  {path: '', redirectTo: 'candidate', pathMatch: 'full'},
  {
    path: 'candidate', component: SettingsComponent, children: [
      {path: '', redirectTo: 'account', pathMatch: 'full'},
      {path: 'account', component: CaAccountSettingsComponent},
      {path: 'profile', component: CaProfileSettingsComponent},
      {path: '**', redirectTo: 'account'}
    ]
  },
  {
    path: 'business', component: SettingsComponent, children: [
      {path: '', redirectTo: 'account', pathMatch: 'full'},
      {path: 'account', component: BsAccountSettingsComponent},
      {path: 'profile', component: BsProfileSettingsComponent},
      {path: '**', redirectTo: 'account'}
    ]
  },
  {path: '**', redirectTo: 'candidate'}
];

@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule {
}
