/// chat.module.ts
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChatService} from './chat.service';
import {ChatDialogComponent, DialogContentExampleDialogComponent} from './chat-dialog/chat-dialog.component';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule
  ],
  declarations: [
    ChatDialogComponent,
    DialogContentExampleDialogComponent
  ],
  entryComponents: [
    ChatDialogComponent,
    DialogContentExampleDialogComponent
  ],
  exports: [ChatDialogComponent], // <-- export here
  providers: [ChatService]
})
export class ChatModule {
}
