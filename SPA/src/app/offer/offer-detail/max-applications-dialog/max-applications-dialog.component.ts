import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Router} from '@angular/router';

export interface DialogData {
  header: string;
}


@Component({
  selector: 'app-max-applications-dialog',
  templateUrl: './max-applications-dialog.component.html',
  styleUrls: ['./max-applications-dialog.component.scss']
})
export class MaxApplicationsDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public dialogRef: MatDialogRef<DialogData>,
              private router: Router) {
  }

  ngOnInit() {
  }

  cancelDialog() {
    this.dialogRef.close(false);
  }

  goPremium() {
    this.dialogRef.close(false);
    this.router.navigate(['/plans']);
  }
}
