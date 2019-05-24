import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {shared, cleanEngine} from '../../assets/engine/commons';
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
import { mango } from '../../assets/engine/commons';

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
  screenWidth = 0;

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
  // loop requestAnimationFrame
  rAF = null;

  manager = new TResourceManager();
  motor = new TMotorTAG(this.manager);
  scene = this.motor.createRootNode();

  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('thisIsKwee') thisIsKweeHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    if (event.target.innerWidth <= 599) {
      this.screenWidth = 1;
    } else if (event.target.innerWidth > 599 && event.target.innerWidth <= 850) {
      this.screenWidth = 2;
    } else if (event.target.innerWidth > 850 && event.target.innerWidth <= 1600) {
      this.screenWidth = 3;
    } else {
      this.screenWidth = 4;
    }
    if(allowActions.card){
      this.configCard();
    }
  }

  constructor(private router: Router, private titleService: Title, private store$: Store<fromApp.AppState>) {
    this.disabled = true;
  }

  async ngOnInit() {
    // Title stuff
    this.titleService.setTitle('Kwee - Home');
    // Data for the engine
    this.query= {...this.query, status: '0'};
    this.store$.dispatch(new OffersActions.TryGetOffers({page: 1, limit: 25, params: this.query, order: '0'}));
    this.offersState = this.store$.pipe(select(state => state.offers));
    this.offersState.pipe(
      select(s => s.offers)
    ).subscribe(
      (data: any) => {
        if (data) {
          this.fetchedOffers = [];
          // console.log(data.data);
          data.data.forEach((e, i) => {
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
              index: i,
              lat: e.userLat,
              lon: e.userLon
            });
          });
        }
        // console.log(this.offerImages);
        // console.log(this.fetchedOffers);
      });
    // initializations
    this.disabled = false;
    this.currentIndex = -1;

    // this.context2d.translate(0.5,0.5);
    let width  = window.innerWidth;
    if (width <= 599) {
      this.screenWidth = 1;
    } else if (width > 599 && width <= 850) {
      this.screenWidth = 2;
    } else {
      this.screenWidth = 3;
    }

    // engine ts main
    this.offerShow();

  }

  getOfferContractType(contractType) {
    if (contractType > -1) {
      return ContractType[contractType];
    }
  }

  async offerShow() {

    this.canvas = document.getElementById('kweelive');
    await shared(true);  // true = landing (NO ZOOM)
    // this.currentIndex++;
    // shaders
    await mainInit(this.motor, this.manager);

    // ----- MESHES -----
    // console.log(this.scene);

    // Earth
    const landMaterial = this.motor.createMaterial(
      /* color */    [0.258, 0.960, 0.6, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0],
      /* shiny */    3 );
    const LOD_earth = this.motor.dynamicMeshArrayLazyLoading(this.scene, ['0_earth.json', '2_earth_SS.json'], landMaterial);

    // Sea
    const seaMaterial = this.motor.createMaterial(
      /* color */    [0.313, 0.678, 0.949, 1.0],
      /* specular */ [1.0, 1.0, 1.0, 1.0],
      /* shiny */    15 );

    const LOD_sea = this.motor.dynamicMeshArrayLazyLoading(this.scene, ['0_sea.json', '2_sea_SS.json'], seaMaterial);

    mango.lastFrameTime = Date.now();

    // ----- CAMERA -----
    const camera = this.motor.createCamera(this.scene);
    this.motor.enableCam(camera);

    let camPos = [];

    let point = this.motor.get3DfronLatLon(40.415363, -3.707398);
    mango.targetPoint =  this.motor.get3DfronLatLon(40.415363, -3.707398);
    allowActions.p = mango.targetPoint;

    this.motor.easeCamera();
    camPos.push(point[0] * mango.zoom);
    camPos.push(point[1] * mango.zoom);
    camPos.push(point[2] * mango.zoom);

    this.motor.cameraLookAt( camera, [...camPos],
      [0,0,0],
      [0,1,0]);

    this.motor.calculateViews();
    mango.auxViewMatrix = mango.viewMatrix;

    // ----- LIGHTS -----
    const light =  this.motor.createLight(this.scene, 1, [0.2, 0.2, 0.2, 1.0],  [1.0, 1.0, 1.0, 1.0],  [0.5, 0.5, 0.5, 1.0], [10.0, 10.0, 10.0]);
    this.motor.calculateLights();

    // ----- RENDER LOOP -----
    let number = 0;

    let then = 0;
    let last = 0;
    /*
      Fases
      0 => wait 5s
      1 => wait 1s hide previous card & rotate to point
      2 => wait 1.5s show focus and card
      default => prevent init errors
     */
    mango.fase = null;
    const thisContext = this;
    const loop = function(now) {
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      switch (mango.fase) {
        /// wait 5s
        case 0:
          if(now - last >= 5000) {
            last = now;
            mango.fase = 1;
            if(thisContext.currentIndex === (thisContext.fetchedOffers.length - 1)){
              thisContext.currentIndex = -1;
            }
          }
          break;
        case 1:
          if(now - last >= 1000) {
            last = now;
            allowActions.card = false;
            if (thisContext.fetchedOffers.length > 0) {
              mango.fase = 2;
              thisContext.currentIndex++;
              allowActions.random = thisContext.motor.rotateCamToRandomXYOffset(+thisContext.fetchedOffers[thisContext.currentIndex].lat, +thisContext.fetchedOffers[thisContext.currentIndex].lon, 1, thisContext.screenWidth);
            }
          }
          break;
        case 2:
          if(now - last >= 1500) {
            allowActions.point = thisContext.motor.calculateTarget2Dfrom3DPoint();
            allowActions.card = true;
            thisContext.motor.createFocus(thisContext.scene, 100, 'straight', mango.targetPoint , 'normal', null, [1,0.25,0.51, 1.0]);
            let fireworks = thisContext.motor.createFocus(thisContext.scene, 150, 'fireworks', mango.targetPoint , 'normal', null, [1,0.5,0.67, 1.0]);
            setTimeout(() => {
              thisContext.motor.deleteFocus(fireworks);
            }, 800);
            last = now;
            mango.fase = 0;
          }
          break;
        case 3:
          if(now - last >= 1000) {
            last = now;
            mango.fase = 1;
          }
          break;
        default:
          //console.log(-1);
          last = now;
          if(mango.fase == -1){
            mango.fase = 3;
          }
          break;
      }
      thisContext.rAF = requestAnimationFrame(loop);
    };

    await this.motor.init();
    mango.eRAF = requestAnimationFrame(this.motor.render);
    this.rAF = requestAnimationFrame(loop);
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

    // let point = this.motor.computeCoordenates(this.fetchedOffers[this.currentIndex].userLat, this.fetchedOffers[this.currentIndex].userLon);
    if(!this.arraysEqual(this.previousPosition, allowActions.point)) {
      // this.currentIndex++;
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
    cancelAnimationFrame(this.rAF);
    cancelAnimationFrame(mango.eRAF);
    this.motor = null;
    this.scene = null;
    this.manager = null;
    resetCanvas();
    cleanEngine();
  }

  scrollTo(element: HTMLElement) {
    element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
  }

  goToSignUp(userType: string) {
    this.router.navigate(['/signup'], {queryParams: {type: userType}});
  }

  // LONGITUDE -180 to + 180
  generateRandomLong() {
    return +(Math.random() * (180 - (-180)) + (-180)).toFixed(3) * 1;
  }
  // LATITUDE -90 to +90
  generateRandomLat() {
    return +(Math.random() * (90 - (-90)) + (-90)).toFixed(3) * 1;
  }
}
