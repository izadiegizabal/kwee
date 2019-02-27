import {Component, Input, OnInit} from '@angular/core';
import {UtilsService} from '../../shared/utils.service';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';
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
    return '/offer/' + this.offer.id + '/' + this.offer.title.toLowerCase().replace(/ /g, '-');
  }


  getPublishedDate() {
    if (this.offer && this.offer.datePublished) {
      return this._utils.getTimePassed(new Date(this.offer.datePublished));
    }
  }

  openShareDialog() {
    this.dialog.open(SnsShareDialogComponent, {
      data: {
        offer: {title: this.offer.title, url: location.hostname + this.urlfyPosition()}
      }
    });
  }

  getOfferSalary() {
    let salaryNum;
    if (this.offer.salaryAmount > 10000) {
      salaryNum = (Number(this.offer.salaryAmount) / 1000).toFixed(1) + 'K';
    } else {
      salaryNum = this.offer.salaryAmount;
    }

    return salaryNum + ' ' +
      this.offer.salaryCurrency + ' ' +
      SalaryFrequency[this.offer.salaryFrequency];
  }

  getOfferDuration() {
    if (this.offer.isIndefinite) {
      return 'Indefinite';
    } else {
      if (this.offer.duration > 1) {
        return this.offer.duration + ' ' + JobDurationUnit[this.offer.durationUnit];
      } else {
        return this.offer.duration + ' ' + JobDurationUnit[this.offer.durationUnit].slice(0, -1);
      }
    }
  }

  getOfferContractType() {
    return ContractType[this.offer.contractType];
  }

  getOfferLocation() {
    let location = this.offer.location ? this.offer.location : '';
    if (location !== '' && this.offer.workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[this.offer.workLocation];
    } else if (location === '') {
      location = WorkLocationType[this.offer.workLocation];
    }

    return location;
  }

  urlOfferer() {
    const url = '/business/' + this.offer.fk_offerer + '/' + this.offer.offererName.toLowerCase().replace(/ /g, '-');
    return url;
  }

}
