import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {BsAccountSettingsComponent} from './business-settings/bs-account-settings/bs-account-settings.component';
import {BsProfileSettingsComponent} from './business-settings/bs-profile-settings/bs-profile-settings.component';

const settingsRoutes: Routes = [
  {
    path: '', component: SettingsComponent, children: [
      {path: '', redirectTo: 'account', pathMatch: 'full'},
      {path: 'account', component: BsAccountSettingsComponent},
      {path: 'profile', component: BsProfileSettingsComponent},
      {path: '**', redirectTo: 'account'}
    ]
  },
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
