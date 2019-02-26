import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';


@Component({
  selector: 'app-user-preview-card',
  templateUrl: './user-preview-card.component.html',
  styleUrls: ['./user-preview-card.component.scss']
})
export class UserPreviewCardComponent implements OnInit {

  @Input() user: any;


  userUrl: string;


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userUrl = this.urlfyPosition();
  }

  urlfyPosition() {
    return '/user/' + this.user.id + '/' + this.user.name.toLowerCase().replace(/ /g, '-');
  }


  openShareDialog() {
    this.dialog.open(SnsShareDialogComponent, {
      data: {
        offer: {title: this.user.name, url: location.hostname + this.urlfyPosition()}
      }
    });
  }
}
