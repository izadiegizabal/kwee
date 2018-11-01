import {Component, OnInit} from '@angular/core';
import {Offer} from '../Offer';

@Component({
  selector: 'app-offer-preview-card',
  templateUrl: './offer-preview-card.component.html',
  styleUrls: ['./offer-preview-card.component.scss']
})
export class OfferPreviewCardComponent implements OnInit {
  offer: Offer;

  constructor(offr: Offer) {
    this.offer = offr;
  }

  ngOnInit() {
  }

}
