import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {shared} from '../../assets/engine/commons';
import {allowActions, mainInit, mainR, resetCanvas, setSceneWidth} from '../../assets/engine/main';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit, OnDestroy {

  disabled: boolean;
  particles: boolean;
  auxCanvas = null;
  canvas = null;
  context2d = null;
  changed = 0;
  cardArrowType = 'up';
  cardPosition = [0, 0];

  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('thisIsKwee') thisIsKweeHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.target.innerWidth <= 599) {
      setSceneWidth(1);
    } else if (event.target.innerWidth > 599 && event.target.innerWidth <= 850) {
      setSceneWidth(2);
    } else {
      setSceneWidth(3);
    }
    if(allowActions.card){
      this.configCard();
    }
  }

  constructor(private router: Router, private titleService: Title) {
    this.disabled = true;
  }

  async ngOnInit() {
    this.titleService.setTitle('Kwee - Home');
    this.disabled = false;
    await shared();
    await mainInit();
    this.drawHollow();
    this.canvas = document.getElementById('kweelive');
    // this.context2d.translate(0.5,0.5);
    let width  = window.innerWidth;
    if (width <= 599) {
      setSceneWidth(1);
    } else if (width > 599 && width <= 850) {
      setSceneWidth(2);
    } else {
      setSceneWidth(3);
    }
  }

  getAllow() {
    return !allowActions.value;
  }

  getCoords(){
    return this.cardPosition;
  }

  getShowCard() {
    // return true;
    if(allowActions.card) {
      this.configCard();
    }
    return allowActions.card;
  }

  configCard(){
    switch (allowActions.random) {
      case  0:
      case  3:
      case  8:
        this.cardArrowType = 'down';
        break;
      case  1:
      case  6:
        this.cardArrowType = 'up';
        break;
      case  2:
      case  5:
        this.cardArrowType = 'left';
        break;
      case  4:
      case  7:
        this.cardArrowType = 'right';
        break;
      default:
        this.cardArrowType = 'down';
        break;
    }
    if(!this.canvas){
      this.canvas = document.getElementById('kweelive');
    }
    let cs     = getComputedStyle(this.canvas);
    let width  = window.innerWidth;
    this.changed = width;
    let virtualWidth = parseInt( cs.getPropertyValue('width'), 10);
    // auxiliary operations
    let off = parseInt((this.canvas as HTMLCanvasElement).style.width, 10);
    let p = [((1 + allowActions.point[0]/allowActions.point[3])*((virtualWidth)/2)), ((1 - allowActions.point[1]/allowActions.point[3])*(virtualWidth)/2)];
    let x2Offset = (virtualWidth - width) / 2;
    let xTotalOffset = virtualWidth - width;
    let percent = (p[0] - x2Offset) / (virtualWidth - xTotalOffset);
    // x coordinate
    if (width > 1400){
      p[0] = width * percent - ((width - 1400) / 2);
    } else { p[0] = width * percent }
    // y coordinate
    if (off === 123) {
      p[1] = (p[1]); // -144 -64
    } else {
      p[1] = (p[1]); // -144 -64

    }
    // update coordinates to bind
    this.cardPosition = p;
  }

  drawTriangle(array){
    let cs     = getComputedStyle(this.auxCanvas);
    let width  = parseInt( cs.getPropertyValue('width'), 10);
    let height = parseInt( cs.getPropertyValue('height'), 10);
    this.context2d.clearRect(0, 0, width, height);
    //console.log(this.auxCanvas);
    let point = [];
    let aux = 0;
    array.forEach( (e) => {
      aux = Math.round(e);//this.decimalAdjust('round', e,1);
      if (aux % 2 !== 0){
        point.push(aux + 1);
      } else { point.push(aux); }
    });
    // console.log(point);
    // the triangle

    // this.context2d.translate(0.5,0.5);
    this.context2d.beginPath();
    this.context2d.moveTo(365 * 2, 180 * 2);
    this.context2d.lineTo(335 * 2, 180 * 2);
    console.log('*********');
    console.log(point[0]);
    this.context2d.lineTo(point[0], point[1] - 6);
    this.context2d.closePath();

    this.context2d.strokeStyle = '#FFF';
    this.context2d.lineWidth = 2;
    this.context2d.stroke();

    this.context2d.fillStyle = "#FFF";
    this.context2d.fill();

  }

  drawHollow() {
    resetCanvas();
    mainR(false, this.particles);
  }

  async reset() {
    resetCanvas();
  }

  onSearch(query: string) {
    this.router.navigate(['/candidate-home'], {queryParams: {keywords: query}});
  }

  ngOnDestroy() {
    resetCanvas();
  }

  scrollTo(element: HTMLElement) {
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }

  goToSignUp(userType: string) {
    this.router.navigate(['/signup'], {queryParams: {type: userType}});
  }
}
