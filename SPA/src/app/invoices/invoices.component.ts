import {Component, OnInit} from '@angular/core';

interface Invoice {
  id: number;
  date: Date;
  offer: string;
  total: number;
  currency: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  invoices: Invoice[] = [];

  constructor() {
  }

  ngOnInit() {
    this.invoices.push({id: 1832, date: new Date(), offer: 'SEO Consultant', total: 5.95, currency: 'EUR'});
    this.invoices.push({id: 2212, date: new Date(), offer: 'Dialogflow development', total: 5.95, currency: 'CAD'});
    this.invoices.push({id: 4562, date: new Date(), offer: 'Backend Developer', total: 5.95, currency: 'EUR'});
  }

  getDate(date: Date) {
    return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

}
