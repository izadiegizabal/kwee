import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-offer-preview-card',
  templateUrl: './offer-preview-card.component.html',
  styleUrls: ['./offer-preview-card.component.scss']
})
export class OfferPreviewCardComponent implements OnInit {
  offer: {
    title: string,
    description: string,
    id: number,
    location: string,
    publishDate: string,
  } = {
    title: 'Senior SEO Consultant',
    description: 'A search engine optimization consultant (or SEO consultant) is a job that analyzes and reviews websites and\n' +
      '      their incoming links in order to provide expert advice, guidance, and recommendations to business owners\n' +
      '      seeking to earn more natural search engine traffic and higher ranking positions.A search engine optimization consultant ' +
      '(or SEO consultant) is a job that analyzes and reviews websites and\n' +
      '      their incoming links in order to provide expert advice, guidance, and recommendations to business owners\n' +
      '      seeking to earn more natural search engine traffic and higher ranking positions.',
    id: 5,
    location: 'Remote',
    publishDate: '3 weeks ago'
  };

  offerUrl: string;

  constructor() {
  }

  ngOnInit() {
    this.offerUrl = this.urlfyPosition();
  }

  urlfyPosition() {
    return '/offer/' + this.offer.id + '/' + this.offer.title.toLowerCase().replace(/ /g, '-');
  }
}
