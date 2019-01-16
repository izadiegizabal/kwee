import {Component, Input, OnInit} from '@angular/core';
import {UtilsService} from '../utils.service';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../sns-share/sns-share-dialog/sns-share-dialog.component';


@Component({
  selector: 'app-offer-preview-card',
  templateUrl: './offer-preview-card.component.html',
  styleUrls: ['./offer-preview-card.component.scss']
})
export class OfferPreviewCardComponent implements OnInit {

  offerUrl: string;

  @Input() offer: any;


  constructor(private _utils: UtilsService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.offerUrl = this.urlfyPosition();
  }

  urlfyPosition() {
    return '/offer/' + this.offer.user.id + '/' + this.offer.offer.title.toLowerCase().replace(/ /g, '-');
  }


  getPublishedDate() {
    if (this.offer && this.offer.offer.datePublished) {
      return this._utils.getTimePassed(new Date(this.offer.offer.datePublished));
    }
  }

  openShareDialog() {
    this.dialog.open(SnsShareDialogComponent, {
      data: {
        offer: {title: this.offer.offer.title, url: location.hostname + this.urlfyPosition()}
      }
    });
  }
}
