import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {AdminStatisticsComponent} from './admin-statistics/admin-statistics.component';
import {AdminManageCandidatesComponent} from './admin-manage-candidates/admin-manage-candidates.component';
import {AdminManageBusinessesComponent} from './admin-manage-businesses/admin-manage-businesses.component';
import {AdminVerifyComponent} from './admin-verify/admin-verify.component';
import {AdminReportsComponent} from './admin-reports/admin-reports.component';
import {AdminManageOffersComponent} from './admin-manage-offers/admin-manage-offers.component';
import {UserLogComponent} from './user-log/user-log.component';

const adminRoutes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      {path: '', redirectTo: 'manage-candidates', pathMatch: 'full'},
      {path: 'manage-candidates', component: AdminManageCandidatesComponent},
      {path: 'manage-businesses', component: AdminManageBusinessesComponent},
      {path: 'manage-offers', component: AdminManageOffersComponent},
      {path: 'verify', component: AdminVerifyComponent},
      {path: 'reports', component: AdminReportsComponent},
      {path: 'messages', redirectTo: '/messages'},
      {path: 'statistics', component: AdminStatisticsComponent},
      {path: 'user-log', component: UserLogComponent},
      {path: '**', redirectTo: 'manage-candidates'}
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {

}
