import {Component, OnInit} from '@angular/core';
import {PaypalDialogComponent} from '../paypal-dialog/paypal-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-premium-candidate',
  templateUrl: './premium-candidate.component.html',
  styleUrls: ['./premium-candidate.component.scss']
})
export class PremiumCandidateComponent implements OnInit {

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  callPaypalDialog(id, product, price) {
    this.dialog.open(PaypalDialogComponent, {
      data: {
        header: 'Order summary: ',
        product: 'Subscribe to premium',
        idproduct: id,
        price: '5.99€'
      }
    });
  }

}
