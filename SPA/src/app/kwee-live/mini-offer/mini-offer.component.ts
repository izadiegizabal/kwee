import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {getUrlfiedString} from '../../shared/utils.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-mini-offer',
  templateUrl: './mini-offer.component.html',
  styleUrls: ['./mini-offer.component.scss'],
  animations: [
    trigger('EnterLeave', [
      transition(':enter', [
        style({borderRadius: '50%', height: '0px', width: '0px', opacity: 0, transform: 'scale(0)' }),
        animate('0.5s ease-in-out', style({borderRadius: '3%', height: '80px', width: '270px', opacity: 1 , transform: 'scale(1)'}))
      ]),
      transition(':leave', [
        style({borderRadius: '3%', height: '80px', width: '270px', opacity: 1 , transform: 'scale(1)'}),
        animate('0.5s ease-out', style({borderRadius: '50%', height: '0px', width: '0px', opacity: 0, transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class MiniOfferComponent implements OnInit {

  points = [0 , 0];
  className = 'down';

  @Input() obj: any;
  @Input()
  set class(c: string) {
    this.className = c;
    this.setType();
  }
  @Input()
  set point(point: number[]) {
    this.points = point;
    this.setType();
  }

  constructor() {
  }

  ngOnInit() {
    if(!this.obj.img){
      this.obj.img = '../../assets/img/defaultProfileImg.png'
    }
  }

  getImage(){
      return !this.obj.img ? this.obj.img = '../../assets/img/defaultProfileImg.png' : this.obj.img;
  }

  private getBGColour() {
    // return getColourFromIndex(this.index);
  }

  setType() {
    document.getElementById("offerBubble").className = this.className;
    let d = document.getElementById('offerBubble');
    switch (this.className) {
      case 'down':
        d.style.left = (this.points[0] - parseInt(getComputedStyle(d).width,10)/2)+'px';
        d.style.top = (this.points[1] - parseInt(getComputedStyle(d).height,10) - 70 - 7)+'px';
        break;
      case 'up':
        d.style.left = (this.points[0] - parseInt(getComputedStyle(d).width,10)/2)+'px';
        d.style.top = (this.points[1] + parseInt(getComputedStyle(d).height,10) - 10)+'px';
        break;
      case 'left':
        d.style.left = (this.points[0] - parseInt(getComputedStyle(d).width,10) + 70 + (270))+'px';
        d.style.top = (this.points[1] - parseInt(getComputedStyle(d).height,10)/2 - 7)+'px';
        break;
      case 'right':
        d.style.left = (this.points[0] - parseInt(getComputedStyle(d).width,10) - 70)+'px';
        d.style.top = (this.points[1] - parseInt(getComputedStyle(d).height,10)/2 - 7)+'px';
        break;
    }
  }

  urlfyPosition() {
      return this.obj.id ? '/offer/' + this.obj.id + '/' + getUrlfiedString(this.obj.title) : '/404';
  }
}
