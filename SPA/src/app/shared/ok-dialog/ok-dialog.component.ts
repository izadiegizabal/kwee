import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogData} from '../../auth/signup/dialog-error/dialog-error.component';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-ok-dialog',
  templateUrl: './ok-dialog.component.html',
  styleUrls: ['./ok-dialog.component.scss']
})
export class OkDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogData>) { }

  ngOnInit() {
  }

  ok() {
    this.dialogRef.close(true);
  }

}
