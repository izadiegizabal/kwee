import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';
import {getUrlfiedString} from '../../../shared/utils.service';
import {BusinessPreview} from '../../../../models/business-preview.model';
import {BusinessIndustries} from '../../../../models/Business.model';


@Component({
  selector: 'app-business-preview-card',
  templateUrl: './business-preview-card.component.html',
  styleUrls: ['./business-preview-card.component.scss']
})
export class BusinessPreviewCardComponent implements OnInit {

  @Input() user: BusinessPreview = null;

  userUrl: string;


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userUrl = this.urlfyPosition();
  }

  urlfyPosition() {
    return '/business/' + this.user.id + '/' + getUrlfiedString(this.user.name);
  }


  openShareDialog() {
    this.dialog.open(SnsShareDialogComponent, {
      data: {
        offer: {title: this.user.name, url: location.hostname + this.urlfyPosition()}
      }
    });
  }

  getWorkfield() {
    // TODO: delete this dirty fix when api returns correctly
    return (BusinessIndustries[this.user.workfield]) ? BusinessIndustries[this.user.workfield] : 'Designer';
  }

  getSize() {
    // TODO: delete this dirty fix when api returns correctly
    const size = (BusinessIndustries[this.user.companySize]) ? BusinessIndustries[this.user.companySize] : '100';
    return size + ' people';
  }

  getImg() {
    // TODO: delete this dirty fix when api returns correctly
    const defaultImg = 'https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/' +
      'filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg';
    return this.user.imgPath ? this.user.imgPath : defaultImg;
  }
}
