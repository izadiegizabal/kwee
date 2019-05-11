import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatInput, MatSidenav} from '@angular/material';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;
  @ViewChild('search') searchInput: MatInput;
  @Input() searchHint;
  @Output() search = new EventEmitter<string>();
  myControl = new FormControl();

  constructor() {
  }

  private _alreadySearched;

  @Input() set alreadySearched(value: string) {
    this._alreadySearched = value;
    this.myControl.setValue(this._alreadySearched);
  }

  ngOnInit() {
    this.searchInput.focus();
  }

  onSubmit() {
    this.search.emit(this.myControl.value);
  }
}
