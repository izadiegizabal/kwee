import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PaypalDialogComponent} from '../paypal-dialog/paypal-dialog.component';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';

@Component({
  selector: 'app-premium-business',
  templateUrl: './premium-business.component.html',
  styleUrls: ['./premium-business.component.scss']
})
export class PremiumBusinessComponent implements OnInit {


  constructor(public dialog: MatDialog,
              private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
  }

  callPaypalDialog(id, product, price) {
    this.dialog.open(PaypalDialogComponent, {
      data: {
        header: 'Order summary: ',
        idproduct: id,
        product: product,
        price: price
      }
    });
  }

}
