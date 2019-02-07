import {Component, Input, OnInit} from '@angular/core';
import {UtilsService} from '../utils.service';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../sns-share/sns-share-dialog/sns-share-dialog.component';
import {ContractType, JobDurationUnit, SalaryFrequency, WorkLocationType} from '../../../models/Offer.model';


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
    return '/offer/' + this.offer.offer.id + '/' + this.offer.offer.title.toLowerCase().replace(/ /g, '-');
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

  getOfferSalary() {
    const salary =
      this.offer.offer.salaryAmount +
      this.offer.offer.salaryCurrency + ' ' +
      SalaryFrequency[this.offer.offer.salaryFrecuency];
    return salary;
  }

  getOfferDuration() {
    if (this.offer.offer.isIndefinite) {
      return 'Indefinite';
    } else {
      if (this.offer.offer.duration > 1) {
        return this.offer.offer.duration + ' ' + JobDurationUnit[this.offer.offer.durationUnit];
      } else {
        return this.offer.offer.duration + ' ' + JobDurationUnit[this.offer.offer.durationUnit].slice(0, -1);
      }
    }
  }

  getOfferContractType() {
    return ContractType[this.offer.offer.contractType];
  }

  getOfferLocation() {
    let location = this.offer.offer.location ? this.offer.offer.location : '';
    if (location !== '' && this.offer.offer.workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[this.offer.offer.workLocation];
    } else if (location === '') {
      location = WorkLocationType[this.offer.offer.workLocation];
    }

    return location;
  }

  urlOfferer() {
    const url = '/business/' + this.offer.user.id + '/' + this.offer.user.name.toLowerCase().replace(/ /g, '-');
    return url;
  }

}
