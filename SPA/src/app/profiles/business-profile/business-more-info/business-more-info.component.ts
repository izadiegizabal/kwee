import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-business-more-info',
  templateUrl: './business-more-info.component.html',
  styleUrls: ['./business-more-info.component.scss']
})
export class BusinessMoreInfoComponent implements OnInit {

  @Input() business: any;

  constructor() {
  }

  ngOnInit() {
  }

  getSize() {
    let size = 'Information not available.';
    switch (Number(this.business.size)) {
      case 10:
        size = 'Less than 10 people.';
        break;
      case 50:
        size = 'Between 11 and 50 people.';
        break;
      case 100:
        size = 'Between 51 and 100 people.';
        break;
      case 1000:
        size = 'More than 1.000 people.';
        break;
    }

    return size.substring(0, size.length - 1);
  }
}
