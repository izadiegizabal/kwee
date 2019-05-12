import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-orderby-button',
  templateUrl: './orderby-button.component.html',
  styleUrls: ['./orderby-button.component.scss']
})
export class OrderbyButtonComponent implements OnInit {
  @Input() orderBy: {
    value,
    viewValue
  }[] = [
    {value: 0, viewValue: 'Relevance'},
    {value: 1, viewValue: 'Kwee Index'},
    {value: 2, viewValue: 'Distance'},
    {value: 3, viewValue: 'Salary'},
    {value: 5, viewValue: 'Start Date'},
    {value: 4, viewValue: 'Published Date'},
    {value: 6, viewValue: 'Selection Date'},
  ];
  @Output() selectedValue = 0;
  @Output() changeSelectedValue = new EventEmitter();
  selectedViewValue;

  constructor() {
  }

  ngOnInit() {
    this.selectedViewValue = this.orderBy[0].viewValue;
  }

  onChange(order) {
    this.selectedViewValue = order.viewValue;
    this.selectedValue = order.value;
    this.changeSelectedValue.emit(this.selectedValue);
  }

}
