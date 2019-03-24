import {Component, Inject, OnInit} from '@angular/core';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';


export interface DialogData {
  header: string;
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

  public payPalConfig?: PayPalConfig;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public dialogRef: MatDialogRef<DialogData>) {
  }

  ngOnInit(): void {
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
