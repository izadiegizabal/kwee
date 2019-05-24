import {Component, OnInit} from '@angular/core';
import {PaypalDialogComponent} from '../paypal-dialog/paypal-dialog.component';
import {MatDialog} from '@angular/material';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromAuth from '../../auth/store/auth.reducers';
import * as fromApp from '../../store/app.reducers';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-premium-candidate',
  templateUrl: './premium-candidate.component.html',
  styleUrls: ['./premium-candidate.component.scss']
})
export class PremiumCandidateComponent implements OnInit {
  authState: Observable<fromAuth.State>;
  premium = 0;


  constructor(public dialog: MatDialog, private store$: Store<fromApp.AppState>) {
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
        product: product,
        idproduct: id,
        price: price,
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
