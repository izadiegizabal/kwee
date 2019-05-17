import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {shared} from '../../assets/engine/commons';
import {allowActions, mainInit, mainR, resetCanvas, setSceneWidth} from '../../assets/engine/main';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import * as OffersActions from "../offer/store/offers.actions";
import {select, Store} from "@ngrx/store";
import * as fromApp from "../store/app.reducers";
import {Observable} from "rxjs";
import * as fromOffers from "../offer/store/offers.reducers";
import {environment} from '../../environments/environment';

import { TMotorTAG } from '../../assets/engine/TMotorTAG';
import { TResourceManager } from '../../assets/engine/resourceManager';
import { global } from '../../assets/engine/commons';

import {ContractType} from '../../models/Offer.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})


// TAG.50
// TAG.51
export class LandingComponent implements OnInit, OnDestroy {

  // booleans for actions
  disabled: boolean;
  particles: boolean;

  // canvas "global" variables
  auxCanvas = null;
  canvas = null;
  context2d = null;

  // new width screen size
  changed = 0;

  // default values
  cardArrowType = 'up';
  cardPosition = [0, 0];

  // Offer stuff
  offersState: Observable<fromOffers.State>;
  query: any;

  fetchedOffers = [];
  offerImages = [];

  previousPosition = [];
  currentIndex = -1;

  environment = environment;

  obj = {
    title: 'no title'
  };

  manager = new TResourceManager();
  motor = new TMotorTAG(this.manager);
  scene = this.motor.createRootNode();


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

  constructor(private router: Router, private titleService: Title, private store$: Store<fromApp.AppState>) {
    this.disabled = true;
  }

  async ngOnInit() {
    this.titleService.setTitle('Kwee - Home');
    this.disabled = false;
    await shared(false);  // true = interactive Main on ZOOM
    await mainInit();

    //this.main();
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


    this.query= {...this.query, status: '0'};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 25, params: this.query, order: '0'}));
    this.offersState = this.store$.pipe(select(state => state.offers));

    this.offersState.pipe(
      select(s => s.offers)
    ).subscribe(
      (data) => {
        data.data.forEach( (e, i) => {
          // console.log(e);
          // this.offerImages.push(new Image());
          this.offerImages.push(this.environment.apiUrl + e.img);
          // console.log(this.offerImages[i].src);
          this.fetchedOffers.push({
            title: e.title,
            offererIndex: e.offererIndex,
            offererName: e.offererName,
            contractType: this.getOfferContractType(e.contractType),
            location: e.location,
            id: e.id,
            index: i
          });
        });
        // console.log(this.offerImages);
        // console.log(this.fetchedOffers);
      });
  }

  getOfferContractType(contractType) {
    if (contractType > -1) {
      return ContractType[contractType];
    }
  }

  main() {
    const motor = this.motor;

    // ----- MESHES -----
    console.log(this.scene);

    // Earth
    const landMaterial = motor.createMaterial(
      /* color */    [0.258, 0.960, 0.6, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0],
      /* shiny */    3 );
    const LOD_earth = motor.dynamicMeshArrayLazyLoading(this.scene, ['0_earth.json', '2_earth_SS.json'], landMaterial);

    // Sea
    const seaMaterial = motor.createMaterial(
      /* color */    [0.313, 0.678, 0.949, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0],
      /* shiny */    15 );

    const LOD_sea = motor.dynamicMeshArrayLazyLoading(this.scene, ['0_sea.json', '2_sea_SS.json'], seaMaterial);

    global.lastFrameTime = Date.now();

    // ----- CAMERA -----
    const camera = motor.createCamera(this.scene);
    motor.enableCam(camera);

    // @todo -> Flaviu camera stuff

    const radius = 3;
    motor.cameraLookAt( camera, [0, 0, 3],
      [0, 0, 0],
      [0, 1, 0]);
    motor.easeCamera();
    motor.calculateViews();

    // ----- LIGHTS -----
    const light =  motor.createLight(this.scene, 1, [0.2, 0.2, 0.2, 1.0],  [1.0, 1.0, 1.0, 1.0],  [0.5, 0.5, 0.5, 1.0], [10.0, 10.0, 10.0]);
    motor.calculateLights();

    // ----- RENDER LOOP -----
    let number = 0;
    
    const loop = function() {
      global.time = Date.now();

      motor.cameraLookAt( camera, [
        global.zoom * Math.sin(number * Math.PI / 180),
        global.zoom,
        global.zoom * Math.cos(number * Math.PI / 180),
      ],
      [0, 0, 0],
      [0, 1, 0]);
      motor.calculateViews();

      motor.draw();

      global.lastFrameTime = global.time;

      requestAnimationFrame(loop);

      number = number + 0.3;
      if (number > 360) { number = 0; }
    };

    motor.init();
    loop();

  }

  getAllow() {
    return !allowActions.value;
  }

  getCoords() {
    return this.cardPosition;
  }

  getShowCard() {
    // return true;
    if (allowActions.card) {
      this.configCard();
    }
    return allowActions.card;
  }

  configCard() {
    if(!this.arraysEqual(this.previousPosition, allowActions.point)) {
      this.currentIndex++;
      this.previousPosition = allowActions.point;
    }

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
    if (!this.canvas){
      this.canvas = document.getElementById('kweelive');
    }
    const cs     = getComputedStyle(this.canvas);
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
    this.cardPosition = p;
    // update coordinates to bind
    this.obj = {...this.fetchedOffers[this.currentIndex], cardPosition: p, img: this.offerImages[this.currentIndex]};
  }

  arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
      return false;
    for(let i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
        return false;
    }

    return true;
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
