import {Component, Inject, OnInit} from '@angular/core';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as fromAuth from '../../auth/store/auth.reducers';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import * as fromAdmin from '../../admin/store/admin.reducers';
import * as fromInvoice from '../../invoices/store/invoice.reducers';
import * as InvoiceActions from '../../invoices/store/invoice.actions';

import {Router} from '@angular/router';


export interface DialogData {
  header: string;
  idproduct: number;
  product: string;
  price: string;
}

@Component({
  selector: 'app-paypal-dialog',
  templateUrl: './paypal-dialog.component.html',
  styleUrls: ['./paypal-dialog.component.scss']
})
export class PaypalDialogComponent implements OnInit {

  pay = 0;
  priceN: any;
  profileType;
  userId;

  public payPalConfig?: PayPalConfig;

  authState: Observable<fromAuth.State>;
  adminState: Observable<fromAdmin.State>;
  invoiceState: Observable<fromInvoice.State>;


  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              public dialogRef: MatDialogRef<DialogData>,
              private store$: Store<fromApp.AppState>,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authState = this.store$.pipe(select('auth'));
    this.adminState = this.store$.pipe(select(s => s.admin));

    this.authState.pipe(
      select(s => s.user)
    ).subscribe(
      (user) => {
        if (user && user.name && user.id) {
          this.profileType = user.type;
          this.userId = user.id;
        } else {
          this.router.navigate(['/']);
        }
      });

    // console.log(this.userId + 'id usuario' + this.profileType + 'tipo' + this.data.idproduct + 'idproduct');

    this.initConfig();
    const aux = this.data.price.split('€');
    this.priceN = parseFloat(aux[0]);
  }

  private initConfig(): void {
    this.payPalConfig = new PayPalConfig(
      PayPalIntegrationType.ClientSideREST,
      PayPalEnvironment.Sandbox,
      {
        commit: true,
        client: {
          sandbox:
          environment.paypal
        },
        button: {
          label: 'paypal',
          layout: 'vertical'
        },
        onAuthorize: (data, actions) => {
          console.log('Authorize');
          return of(undefined);
        },
        onPaymentComplete: (data, actions) => {
          console.log('OnPaymentComplete');
          this.pay = 1;

          const updateuser = {
            'premium': this.data.idproduct,
          };

          if (this.profileType === 'candidate') {
            this.store$.dispatch(new AdminActions.TryUpdateCandidate({id: this.userId, updatedCandidate: updateuser}));
          } else if (this.profileType === 'business') {
            this.store$.dispatch(new AdminActions.TryUpdateBusiness({id: this.userId, updatedBusiness: updateuser}));
          }
          this.invoiceState = this.store$.pipe(select('invoices'));
          this.store$.dispatch(new InvoiceActions.TryPostInvoice({obj: {product: this.data.product, price: this.data.price}}));
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
          this.pay = 2;
        },
        onError: err => {
          console.log('OnError');
          this.pay = 2;
        },
        onClick: () => {
          console.log('onClick');
        },
        validate: (actions) => {
          // console.log(actions);
        },
        experience: {
          noShipping: true,
          brandName: 'Kwee'
        },
        transactions: [
          {
            amount: {
              total: 5.99,
              currency: 'EUR',
              details: {
                subtotal: 5.90,
                tax: 0.07,
                shipping: 0.01,
                handling_fee: 1.00,
                shipping_discount: -1.00,
                insurance: 0.01
              }
            },
            custom: 'Custom value',
            item_list: {
              items: [
                {
                  name: this.data.product,
                  description: this.data.product,
                  quantity: 1,
                  price: 5.90,
                  tax: 0.07,
                  sku: '1',
                  currency: 'EUR'
                }],
            },
          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );
  }

}
