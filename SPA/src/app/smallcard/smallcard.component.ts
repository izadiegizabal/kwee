import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-smallcard',
  templateUrl: './smallcard.component.html',
  styleUrls: ['./smallcard.component.scss']
})
export class SmallcardComponent implements OnInit {

  name: string = 'Abogados Manolo Rodriguez e hijos';
  index: number = 96;
  description = 'Internet services';

  constructor() {
  }

  ngOnInit() {
  }

}
