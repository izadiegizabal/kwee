import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchBusinessesComponent} from './search-businesses.component';

const searchbusinessesRoutes: Routes = [
  {
    path: '', component: SearchBusinessesComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(searchbusinessesRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class SearchBusinessesRoutingModule {
}
