import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PaypalDialogComponent} from '../paypal-dialog/paypal-dialog.component';

@Component({
  selector: 'app-premium-business',
  templateUrl: './premium-business.component.html',
  styleUrls: ['./premium-business.component.scss']
})
export class PremiumBusinessComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  callPaypalDialog() {
    console.log('abre dialog');
    this.dialog.open(PaypalDialogComponent, {
      data: {
        header: 'Order summary: ',
        product: 'Subscribe to premium',
        price: '5,99€'
      }
    });
  }

}
