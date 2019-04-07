import {Component, OnInit} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as OfferActions from './store/offer.actions';
import * as fromOffer from './store/offer.reducers';
import {Observable} from 'rxjs';
import {OfferEffects} from './store/offer.effects';
import {filter, first} from 'rxjs/operators';
import {Location} from '@angular/common';

import {ContractType, JobDurationUnit, OfferStatus, SalaryFrequency, SeniorityLevel, WorkLocationType} from '../../../models/Offer.model';
import {getTimePassed, getUrlfiedString} from '../../shared/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {
  offerSkills: [' '];
  offerState: Observable<fromOffer.State>;
  authState: any;
  id: any;
  offerId: Number;
  idApplication: Number;
  environment = environment;
  currencies;
  img: any;
  image: any;
  offer: any;
  JSONData: any;

  constructor(
    private titleService: Title,
    private store$: Store<fromApp.AppState>,
    private activatedRoute: ActivatedRoute,
    private offerEffects$: OfferEffects,
    private router: Router,
    private http: HttpClient,
    private location: Location) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;

    this.getCurrencyJSON().subscribe(currencies => {
        this.currencies = currencies;
      }
    );

    this.authState = this.store$.pipe(select('auth'));
    if (this.authState) {
      this.authState.pipe(
        select((s: { user: { id: Number } }) => s.user ? s.user.id : undefined)
      ).subscribe(
        (id) => {
          this.id = id ? id : null;

          if (this.id) {
            this.getApplications();
          }
        });
    }

    if (Number(params.id)) {
      this.offerId = Number(params.id);
      this.store$.dispatch(new OfferActions.TryGetOffer({id: params.id}));
      this.offerState = this.store$.pipe(select(state => state.offer));
      this.offerState.subscribe(s => {
        this.titleService.setTitle('Kwee - ' + s.offer.title);
        this.img = s.offer.img;
        this.offer = s.offer;
      });

      this.offerEffects$.offerGetoffer.pipe(
        filter((action: Action) => action.type === OfferActions.OPERATION_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        this.router.navigate(['/error/404']);
      });
    } else {
      this.router.navigate(['/error/404']);
    }

  }

  getApplications() {
    const params = this.activatedRoute.snapshot.params;

    this.store$.dispatch(new OfferActions.TryGetApplication({id_applicant: this.id, id_offer: params.id}));
  }

  getTimePassed(publishDate) {
    if (publishDate) {
      return getTimePassed(new Date(publishDate));
    }
  }

  getOfferStatus(status) {
    return OfferStatus[status];
  }

  getOfferDuration(isIndefinite, duration, durationUnit) {
    if (isIndefinite) {
      return 'Indefinite';
    } else {
      if (duration > 1) {
        return duration + ' ' + JobDurationUnit[durationUnit];
      } else {
        return duration + ' ' + JobDurationUnit[durationUnit].slice(0, -1);
      }
    }
  }

  getOfferContractType(contractType) {
    if (contractType > -1) {
      return ContractType[contractType];
    }
  }

  getOfferSeniorityLevel(seniority) {
    if (seniority > -1) {
      return SeniorityLevel[seniority] + ' Position';
    }
  }

  getOfferSalary(salaryAmount, salaryCurrency, salaryFrequency) {
    let currency = salaryCurrency;
    if (this.currencies) {
      Object.keys(this.currencies).map(key => {
        if (this.currencies[key].value && this.currencies[key].value === salaryCurrency) {
          currency = this.currencies[key].symbol;
        }
      });
    }
    return salaryAmount + currency + ' ' + SalaryFrequency[salaryFrequency];
  }

  getOfferLocation(offerlocation, workLocation) {
    let location = offerlocation ? offerlocation : '';
    if (location !== '' && workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[workLocation];
    } else if (location === '') {
      location = WorkLocationType[workLocation];
    }

    return location;
  }

  getOfferApplications(applications) {
    if (applications > -1) {
      const numOfApplications = applications;
      return numOfApplications + (numOfApplications === 1 ? ' application' : ' applications');
    }
  }

  getShareableOffer(title) {
    if (title) {
      return {title: title, url: window.location.href};
    }
  }

  getSkills(skills) {
    if (skills) {
      this.offerSkills = skills.split([',']);
      return this.offerSkills;
    }
  }

  postApplication() {
    const params = this.activatedRoute.snapshot.params;
    this.store$.dispatch(new OfferActions.TryPostApplication({fk_offer: params.id}));
  }

  deleteApplication() {
    this.offerState = this.store$.pipe(select(state => state.offer));
    this.offerState.pipe(
      select((s: { applications: { id: Number } }) => s.applications ? s.applications.id : undefined)
    ).subscribe(
      (id) => {
        console.log(id);
        this.idApplication = id;
      });

    this.store$.dispatch(new OfferActions.TryDeleteApplication({fk_application: this.idApplication}));
  }

  urlOfferer(id, name) {
    const url = '/business/' + id + '/' + getUrlfiedString(name);
    return url;
  }

  goEdit() {
    const url = '/offer/' + this.offerId + '/edit';
    this.router.navigate([url]);
  }

  backClicked() {
    this.location.back();
  }

  getCurrencyJSON(): Observable<any> {
    return this.http.get('../../../assets/CurrenciesISO.json');
  }

  searchSkill(skill) {
    console.log(skill);
    this.router.navigate(['/candidate-home'], {queryParams: {keywords: skill}});

  }

  downloadPDF() {
    this.getJSON().pipe(first()).subscribe(data => {
      this.JSONData = data;
      this.getImage(this.environment.apiUrl + 'image/offerers/' + this.img).pipe(first()).subscribe(image => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          this.image = reader.result;
          this.download();
        }, false);
        if (image) {
          reader.readAsDataURL(image);
        }
      });
    });
  }

  download() {

    const doc = new jspdf();

    const img = this.image;
    const offer = this.offer;
    console.log(offer);
    const data = this.JSONData;
    const getDate = this.getDate;
    const out = this;


    doc.setFontSize(40);
    doc.addFileToVFS('assets/fonts/IBMPlexSans-Regular.ttf', data.fonts[0]);
    doc.addFont('assets/fonts/IBMPlexSans-Regular.ttf', 'Plex', 'normal');
    doc.addFileToVFS('assets/fonts/IBMPlexSans-Bold.ttf', data.fonts[1]);
    doc.addFont('assets/fonts/IBMPlexSans-Bold.ttf', 'Plex', 'bold');

    doc.addImage(data.images[0], 'JPEG', 15, 15, 50, 15);
    doc.addImage(img/*env + 'image/offerers/' + img*/, 'JPEG', 15, 62, 30, 30);

    doc.setFontSize(20);
    doc.setFont('Plex', 'bold');
    doc.text('Offer: ' + 'Android Junior Developer', 15, 46);

    doc.setFont('Plex', 'normal');
    doc.setFontSize(12);


    doc.setDrawColor(0);
    doc.setFillColor(29, 233, 182);
    doc.roundedRect(15, 49, 6.5, 6, 1, 1, 'F');
    doc.setTextColor('white');
    doc.text(String(offer.offererIndex), 15.7, 53.4);
    doc.setFontSize(12);
    doc.setTextColor(155);
    doc.setFont('Plex', 'bold');
    doc.text(offer.offererName, 23, 53.4);
    doc.setFont('Plex', 'normal');

    doc.setTextColor(0);
    doc.text('Offer published on ' + getDate(offer.datePublished), 195, 20, null, null, 'right');
    doc.text('Offer expires on ' + getDate(offer.dateEnd), 195, 26, null, null, 'right');

    doc.setFontSize(11);
    const desc = new DOMParser().parseFromString(offer.description, 'text/html').body.childNodes;
    let text = '';
    desc.forEach( e => {
      text += (e as HTMLElement).innerText + '\n';
    });
    const description = text;
    console.log(description);
    var lineHeight = doc.getLineHeight(description) / doc.internal.scaleFactor;
    const splittedText = doc.splitTextToSize(description, 140);
    var lines = splittedText.length;
    var blockHeight = lines * lineHeight;
    var yPos = 65;
    doc.text(50, yPos, splittedText);
    yPos += blockHeight;
// doc.text(50, yPos, '----- This text follows the previous text block.')

    doc.setFontSize(17);
    doc.setFont('Plex', 'bold');
    yPos += 5;
    console.log(yPos);
    if (yPos < 110) {
      yPos = 110;
    }
    doc.text('Details', 15, yPos);
    doc.setFont('Plex', 'normal');
    yPos += 5;
    doc.setFontSize(12);
    doc.addImage(data.images[1], 'JPEG', 16, yPos, 5, 5);
    doc.text(out.getOfferDuration(offer.duration, offer.durationUnit, offer.isIndefinite), 23, yPos + 3.8);
    doc.addImage(data.images[2], 'JPEG', 76, yPos, 5, 5);
    doc.text(out.getOfferContractType(offer.contractType), 83, yPos + 3.8);
    doc.addImage(data.images[3], 'JPEG', 136, yPos, 5, 5);
    doc.text(out.getOfferSalary(offer.salaryAmount , offer.salaryCurrency , offer.salaryFrequency), 143, yPos + 3.8);
    yPos += 10;
    doc.addImage(data.images[4], 'JPEG', 16, yPos, 5, 5);
    doc.text(out.getOfferLocation(offer.location, offer.workLocation), 23, yPos + 3.7);
    doc.addImage(data.images[5], 'JPEG', 76, yPos, 5, 5);
    doc.text(out.getOfferSeniorityLevel(offer.seniority), 83, yPos + 3.7);
    doc.addImage(data.images[6], 'JPEG', 136, yPos, 5, 5);
    doc.text(out.getOfferApplications(offer.currentApplications), 143, yPos + 3.7);
    yPos += 20;
    doc.setFontSize(17);
    doc.setFont('Plex', 'bold');
    doc.text('Responsabilities', 15, yPos);

    doc.setFont('Plex', 'normal');
    yPos += 10;

    doc.setFontSize(12);
    const descript = new DOMParser().parseFromString(offer.responsabilities, 'text/html').body.childNodes;
    text = '';
    descript.forEach( e => {
      text += (e as HTMLElement).innerText + '\n';
    });
    const responsabilities = text;
    console.log(responsabilities);
    var resp = text;
//resp+=resp;
    var lineHeight = doc.getLineHeight(resp) / doc.internal.scaleFactor;
    var sppl = doc.splitTextToSize(resp, 180);
    var lines = sppl.length;
    var blockHeight = lines * lineHeight;
    var antPos = yPos;
    doc.text(sppl, 15, yPos);
    yPos += blockHeight + 10;

// Filled
    doc.setDrawColor(0);
    doc.setFillColor(255);
    doc.rect(0, 284, 210, 100, 'F');

    if (yPos > 282) {
      doc.addPage();


      var newl = 284 - antPos;
      var total = yPos - antPos;
      if (total > newl) {
        // doc.text(String(Math.trunc(newl/lineHeight)), 15, 15);
        let lineasFaltantes = Math.trunc(total / lineHeight) - Math.trunc(newl / lineHeight);
        // doc.text(String(lineasFaltantes), 15, 20);
        var init = -(lines - lineasFaltantes) * lineHeight + 5;
        doc.text(sppl, 15, init);
        yPos = init + blockHeight + 10;
        doc.setFontSize(17);
        doc.setFont('Plex', 'bold');
        doc.text('Requeriments', 15, yPos);
        doc.setFont('Plex', 'normal');

      }

      // Filled
      doc.setDrawColor(0);
      doc.setFillColor(255);
      doc.rect(0, 284, 210, 100, 'F');
      doc.setDrawColor(0);
      doc.setFillColor(255);
      doc.rect(0, 0, 210, 16, 'F');
    } else {
      doc.setFontSize(17);
      doc.setFont('Plex', 'bold');
      doc.text('Requeriments', 15, yPos);
      doc.setFont('Plex', 'normal');
    }


    doc.setFontSize(12);
    const req = offer.requeriments;
    // req+=req;
    lineHeight = doc.getLineHeight(req) / doc.internal.scaleFactor;
    sppl = doc.splitTextToSize(req, 180);
    lines = sppl.length;
    console.log(lines);
    console.log(sppl);
    blockHeight = lines * lineHeight;
    yPos += 10;
    antPos = yPos;
    console.log((282 - yPos) / lineHeight);
    const lastLine = Math.trunc((282 - yPos) / lineHeight);
    doc.text(sppl.slice(0, lastLine), 15, yPos);
    yPos += blockHeight + 10;

    // Filled
    doc.setDrawColor(0);
    doc.setFillColor(255);
    doc.rect(0, 284, 210, 100, 'F');
    doc.setDrawColor(0);
    doc.setFillColor(255);
    doc.rect(0, 0, 210, 15, 'F');

    if (yPos > 282) {
      doc.addPage();

      const newl = 284 - antPos;
      const total = yPos - antPos;
      if (total > newl) {
        // doc.text(String(Math.trunc(newl/lineHeight)), 15, 15);
        const lineasFaltantes = Math.trunc(total / lineHeight) - Math.trunc(newl / lineHeight);
        // doc.text(String(lineasFaltantes), 15, 20);
        const init = 15;
        doc.text(sppl.slice(lastLine), 15, 20);
        yPos = init + (lineHeight * (sppl.length - lastLine)) + 15;
        doc.setFontSize(17);
        doc.setFont('Plex', 'bold');
        doc.text('Skills', 15, yPos);
        doc.setFont('Plex', 'normal');
      }

      doc.setDrawColor(0);
      doc.setFillColor(255);
      doc.rect(0, 284, 210, 100, 'F');
      doc.setDrawColor(0);
      doc.setFillColor(255);
      doc.rect(0, 0, 210, 16, 'F');
    } else {
      doc.setFontSize(17);
      doc.setFont('Plex', 'bold');
      doc.text('Skills', 15, yPos);

      doc.setFont('Plex', 'normal');

    }

    doc.setDrawColor(0);
    doc.setFillColor(255);
    doc.rect(0, 284, 210, 100, 'F');
    doc.setDrawColor(0);
    doc.setFillColor(255);
    doc.rect(0, 0, 210, 16, 'F');

    const skills = offer.skills;
    //skills+=skills;
    //skills+=skills;
    const sk = skills.split(',');
    yPos += 10;
    doc.setFontSize(12);
    let free = Math.trunc((Math.trunc((282 - yPos) / lineHeight) + 1) / 2);
    free *= 2;

    if (free > sk.length) {
      free = sk.length;
    }

    for (let i = 0; i < (free); i++) {

      doc.setLineWidth(1);
      doc.setDrawColor(0);

      if (i % 2 === 0) {


        doc.setFillColor(0, 0, 0);
        doc.circle(15, yPos - 1, 0.5, 'FD');
        doc.text(String(sk[i]), 18, yPos);


      } else {

        doc.setFillColor(0, 0, 0);
        doc.circle(90, yPos - 1, 0.5, 'FD');
        doc.text(String(sk[i]), 93, yPos);
        yPos += lineHeight * 2;

      }
    }

    if (sk.length > free) {
      doc.addPage();
      yPos = 20;
      for (let i = free; i < sk.length; i++) {
        doc.setLineWidth(1);
        doc.setDrawColor(0);

        if (i % 2 === 0) {


          doc.setFillColor(0, 0, 0);
          doc.circle(15, yPos - 1, 0.5, 'FD');
          doc.text(String(sk[i]), 18, yPos);


        } else {

          doc.setFillColor(0, 0, 0);
          doc.circle(90, yPos - 1, 0.5, 'FD');
          doc.text(String(sk[i]), 93, yPos);
          yPos += lineHeight * 2;

        }
      }
    }




    doc.save(offer.title + '.pdf');
  }

  getDate(dt: Date) {
    const date = new Date(dt);
    return date.getUTCDay() + '/' + date.getUTCMonth() + '/' + date.getUTCFullYear();
  }

  getJSON(): Observable < any > {
      return this.http.get('./assets/toPDF.json');
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

}
