import {NgModule} from "@angular/core";
import {SharedModule} from "../shared.module";
import {AlertDialogComponent} from "./alert-dialog.component";

@NgModule({
  declarations: [
    AlertDialogComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    AlertDialogComponent
  ]
})
export class AlertDialogModule {

}
