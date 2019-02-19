import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-kwee-live',
  templateUrl: './kwee-live.component.html',
  styleUrls: ['./kwee-live.component.scss']
})
export class KweeLiveComponent implements OnInit {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;

  constructor() {

  }

  ngOnInit() {
  }
}
