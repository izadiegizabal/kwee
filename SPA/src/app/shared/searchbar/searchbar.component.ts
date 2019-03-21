import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatSidenav;
  @Output() search = new EventEmitter < string >();

  private _alreadySearched;
  @Input() set alreadySearched(value: string) {
    this._alreadySearched = value;
    this.myControl.setValue(this._alreadySearched);
  }


  myControl = new FormControl();
  options: string[] = [/*'SEO Specialist', 'Android Developer', 'JavaScript Expert'*/];
  filteredOptions: Observable<string[]>;

  constructor() {
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  onSubmit() {
    this.search.emit(this.myControl.value);
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
