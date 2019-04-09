import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as jspdf from 'jspdf';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';

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
  JSONData: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.invoices.push({id: 1832, date: new Date(), offer: 'SEO Consultant', total: 5.95, currency: 'EUR'});
    this.invoices.push({id: 2212, date: new Date(), offer: 'Dialogflow development', total: 5.95, currency: 'CAD'});
    this.invoices.push({id: 4562, date: new Date(), offer: 'Backend Developer', total: 5.95, currency: 'EUR'});
  }

  getDate(date: Date) {
    return date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

  downloadPDF(index: number) {
    this.getJSON().pipe(first()).subscribe(data => {
      this.JSONData = data;
      this.download(index);
    });
  }

  download(index: number) {

    const doc = new jspdf();
    const data = this.JSONData;
    const getDate = this.getDate;
    const out = this;
    const num = this.invoices[index].id;
    const total = this.invoices[index].total;
    const curr = this.invoices[index].currency;
    const totalCurr = this.invoices[index].total + ' ' + this.invoices[index].currency;


    doc.setFontSize(40);
    doc.addFileToVFS('assets/fonts/IBMPlexSans-Regular.ttf', data.fonts[0]);
    doc.addFont('assets/fonts/IBMPlexSans-Regular.ttf', 'Plex', 'normal');
    doc.addFileToVFS('assets/fonts/IBMPlexSans-Bold.ttf', data.fonts[1]);
    doc.addFont('assets/fonts/IBMPlexSans-Bold.ttf', 'Plex', 'bold');


    doc.addImage(data.images[0], 'JPEG', 15, 15, 50, 15);

    doc.setFontSize(54);
    doc.setFont('Plex', 'bold');
    doc.text('INVOICE', 14, 65);
    doc.setFontSize(12);
    doc.text('Invoice number', 15, 75);
    doc.text('Date of Issue', 67, 75);
    doc.setFontSize(10);
    doc.setFont('Plex', 'normal');
    doc.text(String(num), 15, 81);
    doc.text('1/4/2019', 67, 81);
    doc.setFont('Plex', 'bold');
    doc.setFontSize(12);
    doc.text('Billed To', 15, 95);
    doc.text('From', 67, 95);
    doc.setFontSize(10);
    doc.setFont('Plex', 'normal');
    const ODir = 'Vultr VAT ID EU372005690 14 Cliffwood Ave Suite 300 Matawan, NJ 07747 United States';

    let sppl = doc.splitTextToSize(ODir, 35);
    doc.text(sppl, 15, 101);
    const lineHeight = doc.getLineHeight(ODir) / doc.internal.scaleFactor;
    const lines = sppl.length;
    const blockHeight = lines * lineHeight;
    const v = 'Kwee,\n' + 'Carretera de San Vicente del Raspeig, s/n, 03690 San Vicente del Raspeig, Alicante, España\n' +
      'hellokwee@gmail.com\n' + 'kwee.com';
    sppl = doc.splitTextToSize(v, 40);
    doc.text(sppl, 67, 101);
    const lineHeight1 = doc.getLineHeight(v) / doc.internal.scaleFactor;
    const lines1 = sppl.length;
    const blockHeight1 = lines1 * lineHeight1;

    let yPos = Math.max(101 + blockHeight, 101 + blockHeight1) + 10;

// Filled red square
    doc.setDrawColor(0);
    doc.setFillColor(69, 90, 100);
    doc.rect(0, yPos, 210, 55, 'F');
    const final = yPos + 55;

    doc.setFont('Plex', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor('white');
    doc.text('Description', 15, yPos + 12.5);
    doc.text('Qty', 165, yPos + 12.5, null, null, 'right');
    doc.text('Amount', 195, yPos + 12.5, null, null, 'right');

    doc.text('Subtotal:', 165, yPos + 40, null, null, 'right');


    doc.text('Tax:', 165, yPos + 47, null, null, 'right');
    doc.setFont('Plex', 'normal');
    doc.text('0 ' + curr, 195, yPos + 47, null, null, 'right');
    doc.text(String(5.95) + ' ' + curr, 195, yPos + 40, null, null, 'right');


    doc.setFontSize(11);
    doc.text('Update to ' + 'Premium', 15, yPos + 25);
    doc.text('1', 165, yPos + 25, null, null, 'right');
    doc.text(String(total) + ' ' + curr, 195, yPos + 25, null, null, 'right');

    yPos += 15;
    doc.setDrawColor(255);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, 195, yPos);
    yPos += 17;
    doc.line(15, yPos, 195, yPos);

    doc.setTextColor('black');
    doc.setFontSize(24);
    doc.text('Total:', 130, final + 25, null, null, 'right');
    doc.setFontSize(40);
    doc.setFont('Plex', 'bold');
    doc.text(totalCurr, 195, final + 29, null, null, 'right');


    doc.setFont('Plex', 'normal');
    doc.setFontSize(24);
    doc.text('PAID', 15, 280);
    doc.setFontSize(12.5);
    doc.setFont('Plex', 'bold');
    doc.text('Terms', 15, 270);

    doc.save('Invoice' + '.pdf');
  }

  getJSON(): Observable<any> {
    return this.http.get('./assets/toPDF.json');
  }

}
