import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {PaypalDialogComponent} from '../paypal-dialog/paypal-dialog.component';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAuth from '../../auth/store/auth.reducers';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-premium-business',
  templateUrl: './premium-business.component.html',
  styleUrls: ['./premium-business.component.scss']
})
export class PremiumBusinessComponent implements OnInit {
  authState: Observable<fromAuth.State>;
  premium = 0;


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

  alert() {
    this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'If you are sure to delete your premium subscription, ' +
          'your account will lose premium privileges at the end of the month.',
      }
    });
  }


}
