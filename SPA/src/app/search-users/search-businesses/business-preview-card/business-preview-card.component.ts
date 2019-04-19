import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';
import {getUrlfiedString} from '../../../shared/utils.service';
import {BusinessPreview} from '../../../../models/business-preview.model';
import {BusinessIndustries} from '../../../../models/Business.model';
import {environment} from '../../../../environments/environment';


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
    return (BusinessIndustries[this.user.workField]) ? BusinessIndustries[this.user.workField] : 'Designer';
  }

  getSize() {
    // TODO: delete this dirty fix when api returns correctly
    const size = (this.user.companySize) ? (this.user.companySize) : '100';
    return size + ' people';
  }

  getImg() {
    const defaultImg = '../../../../../assets/img/defaultProfileImg.png';
    if (this.user.img) {
      return environment.apiUrl + this.user.img;
    } else {
      return defaultImg;
    }
  }
}
