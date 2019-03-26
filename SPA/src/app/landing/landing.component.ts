import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TAnimation, TCamera, TEntity, TLight, TMesh, TTransform} from '../../assets/engine/TEntity';
import {TNode} from '../../assets/engine/TNode';
import {TResourceManager, TResourceMaterial, TResourceMesh, TResourceShader, TResourceTexture} from '../../assets/engine/resourceManager';

import {main, mainTest, pls} from '../../assets/engine/main.js';
import {shared} from '../../assets/engine/commons';
import {allowActions, mainInit, mainR, resetCanvas} from '../../assets/engine/main';
import {Router} from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  disabled: boolean;
  particles: boolean;

  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor(private router: Router, private titleService: Title) {
    this.disabled = true;
  }

  async ngOnInit() {
    this.titleService.setTitle('Kwee - Home');
    this.disabled = false;
    shared();
    await mainInit();
    this.drawHollow();
  }

  getAllow() {
    return !allowActions.value;
  }

  drawHollow() {
    resetCanvas();
    mainR('hollow', this.particles);
  }

  async reset() {
    resetCanvas();
  }

  onSearch(query: string) {
    this.router.navigate(['/candidate-home'], {queryParams: {keywords: query}});
  }
}
