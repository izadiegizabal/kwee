import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  offer: {title: string, url: string};
}

@Component({
  selector: 'app-sns-share-dialog',
  templateUrl: './sns-share-dialog.component.html',
  styleUrls: ['./sns-share-dialog.component.scss']
})
export class SnsShareDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
  }

}
