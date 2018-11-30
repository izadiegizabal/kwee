import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-offer-preview-card',
  templateUrl: './offer-preview-card.component.html',
  styleUrls: ['./offer-preview-card.component.scss']
})
export class OfferPreviewCardComponent implements OnInit {
  position = 'Senior SEO Consultant';
  description = 'A search engine optimization consultant (or SEO consultant) is a job that analyzes and reviews websites and\n' +
    '      their incoming links in order to provide expert advice, guidance, and recommendations to business owners\n' +
    '      seeking to earn more natural search engine traffic and higher ranking positions.A search engine optimization consultant ' +
    '(or SEO consultant) is a job that analyzes and reviews websites and\n' +
    '      their incoming links in order to provide expert advice, guidance, and recommendations to business owners\n' +
    '      seeking to earn more natural search engine traffic and higher ranking positions.';

  constructor() {
  }

  ngOnInit() {
    if (this.description.length > 280) {
      this.description = this.description.substr(0, 280) + '...';
    }
  }

}
