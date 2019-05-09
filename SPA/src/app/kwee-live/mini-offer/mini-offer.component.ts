import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {getUrlfiedString} from '../../shared/utils.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-mini-offer',
  templateUrl: './mini-offer.component.html',
  styleUrls: ['./mini-offer.component.scss'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class MiniOfferComponent implements OnInit {
  @Input() index: number;
  @Input() id: number;
  @Input() name: string;
  @Input() offer: string;
  @Input() location: string;
  @Input() work: string;
  @Input() image: string;
  @Input() url: string;

  constructor() {
  }

  async ngOnInit() {
  }

  private getBGColour() {
    // return getColourFromIndex(this.index);
  }

  urlfyPosition() {
    return '/offer/' + this.id + '/' + getUrlfiedString(this.offer);
  }
}
