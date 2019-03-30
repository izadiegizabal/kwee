import {Component, OnInit} from '@angular/core';
import {PayPalConfig, PayPalEnvironment, PayPalIntegrationType} from 'ngx-paypal';
import {environment} from '../../environments/environment';
import {of} from 'rxjs';
import {RateCandidateComponent} from '../rating/rate-candidate/rate-candidate.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent implements OnInit {

  public payPalConfig?: PayPalConfig;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initConfig();
  }

  rateCandidate() {

    const applications: any[] = [];
    applications.push({to: 0, name: 'Flaviu', index: 77, haveIRated: false});
    applications.push({to: 4, name: 'Marcos', index: 90, haveIRated: true});
    const dialogRef = this.dialog.open(RateCandidateComponent, {
      width: '95%',
      maxHeight: '90%',
      data: {candidate: true, applications: applications}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log(result);
      }
    });
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
        },
        onCancel: (data, actions) => {
          console.log('OnCancel');
        },
        onError: err => {
          console.log('OnError');
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
              total: 30.11,
              currency: 'EUR',
              details: {
                subtotal: 30.00,
                tax: 0.07,
                shipping: 0.03,
                handling_fee: 1.00,
                shipping_discount: -1.00,
                insurance: 0.01
              }
            },
            custom: 'Custom value',
            item_list: {
              items: [
                {
                  name: 'hat',
                  description: 'Brown hat.',
                  quantity: 5,
                  price: 3,
                  tax: 0.01,
                  sku: '1',
                  currency: 'EUR'
                },
                {
                  name: 'handbag',
                  description: 'Black handbag.',
                  quantity: 1,
                  price: 15,
                  tax: 0.02,
                  sku: 'product34',
                  currency: 'EUR'
                }],
              shipping_address: {
                recipient_name: 'Brian Robinson',
                line1: '4th Floor',
                line2: 'Unit #34',
                city: 'San Jose',
                country_code: 'US',
                postal_code: '95131',
                phone: '011862212345678',
                state: 'CA'
              },
            },
          }
        ],
        note_to_payer: 'Contact us if you have troubles processing payment'
      }
    );
  }

}
