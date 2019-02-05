import {NgModule} from '@angular/core';
import {SharedModule} from '../shared.module';
import {RouterModule} from '@angular/router';
import {PaginatorComponent} from './paginator.component';

@NgModule({
  declarations: [
    PaginatorComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [
    PaginatorComponent
  ]
})
export class PaginatorModule {

}
