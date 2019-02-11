import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { KweeLiveComponent } from './kwee-live.component';


const kweeliveRoutes: Routes = [
  {
    path: '', component: KweeLiveComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(kweeliveRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class KweeLiveRoutingModule {

}
