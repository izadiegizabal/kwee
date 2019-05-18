import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {BsAccountSettingsComponent} from './business-settings/bs-account-settings/bs-account-settings.component';
import {BsProfileSettingsComponent} from './business-settings/bs-profile-settings/bs-profile-settings.component';
import {BsUploadSettingsComponent} from './business-settings/bs-upload-settings/bs-upload-settings.component';
import {CaAccountSettingsComponent} from './candidate-settings/ca-account-settings/ca-account-settings.component';
import {CaProfileSettingsComponent} from './candidate-settings/ca-profile-settings/ca-profile-settings.component';
import {CaUploadSettingsComponent} from './candidate-settings/ca-upload-settings/ca-upload-settings.component';

const settingsRoutes: Routes = [
  {path: '', redirectTo: 'candidate', pathMatch: 'full'},
  {
    path: 'candidate', component: SettingsComponent, children: [
      {path: '', redirectTo: 'account', pathMatch: 'full'},
      {path: 'account', component: CaAccountSettingsComponent},
      {path: 'profile', component: CaProfileSettingsComponent},
      {path: 'upload', component: CaUploadSettingsComponent},
      {path: '**', redirectTo: 'account'}
    ]
  },
  {
    path: 'business', component: SettingsComponent, children: [
      {path: '', redirectTo: 'account', pathMatch: 'full'},
      {path: 'account', component: BsAccountSettingsComponent},
      {path: 'profile', component: BsProfileSettingsComponent},
      {path: 'upload', component: BsUploadSettingsComponent},
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
