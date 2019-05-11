import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PaypalDialogComponent} from '../paypal-dialog/paypal-dialog.component';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAuth from '../../auth/store/auth.reducers';

@Component({
  selector: 'app-premium-business',
  templateUrl: './premium-business.component.html',
  styleUrls: ['./premium-business.component.scss']
})
export class PremiumBusinessComponent implements OnInit {
  authState: Observable<fromAuth.State>;
  premium = 2;


  constructor(public dialog: MatDialog,
              private store$: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.authState = this.store$.pipe(select('auth'));
    this.authState.pipe(
      select(s => s.user)
    ).subscribe(
      (user) => {
        if (user && user.premium) {
          this.premium = user.premium;
        }
      });
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
