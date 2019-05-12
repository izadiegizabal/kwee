import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {shared} from '../../assets/engine/commons';
import {allowActions, mainInit, mainR, resetCanvas} from '../../assets/engine/main';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('EnterLeave', [
      transition(':enter', [
        style({opacity: 0}),
        animate('500ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('500ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit, OnDestroy {

  disabled: boolean;
  particles: boolean;

  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('thisIsKwee') thisIsKweeHeader: ElementRef;

  constructor(private router: Router, private titleService: Title) {
    this.disabled = true;
  }

  async ngOnInit() {
    this.titleService.setTitle('Kwee - Home');
    this.disabled = false;
    await shared();
    await mainInit();
    this.drawHollow();
  }

  getAllow() {
    return !allowActions.value;
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

  getShowCard() {
    // return true;
    return allowActions.card;
  }
}
