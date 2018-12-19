import {Component, OnInit} from '@angular/core';
import {
  ContractType,
  JobDurationUnit,
  Offer,
  OfferStatus,
  SalaryFrecuency,
  SeniorityLevel,
  WorkLocationType
} from '../../../models/Offer.model';

@Component({
  selector: 'app-offer-detail',
  templateUrl: './offer-detail.component.html',
  styleUrls: ['./offer-detail.component.scss']
})
export class OfferDetailComponent implements OnInit {
  offer: Offer = {
    // Basic info
    id: 1,
    title: 'Senior SEO Consultant',
    companyId: 2,
    companyName: 'Google',
    companyIndex: 88,
    status: OfferStatus.Open,
    description: 'A search engine optimization consultant (or SEO consultant) is a job that analyzes and reviews websites and\n' +
      '      their incoming links in order to provide expert advice, guidance, and recommendations to business owners\n' +
      '      seeking to earn more natural search engine traffic and higher ranking positions.A search engine optimization consultant ' +
      '(or SEO consultant) is a job that analyzes and reviews websites and\n' +
      '      their incoming links in order to provide expert advice, guidance, and recommendations to business owners\n' +
      '      seeking to earn more natural search engine traffic and higher ranking positions.',
    publishDate: new Date('2018-11-29'),
    selectionStartDate: new Date('2019-12-11'),

    // Details
    duration: 3,
    durationUnit: JobDurationUnit.Months,
    isIndefinite: false,
    contractType: ContractType['Full-Time'],
    salaryAmount: 2500,
    salaryCurrency: '€',
    salaryFrequency: SalaryFrecuency.PerMonth,
    workLocation: WorkLocationType.Remote,
    seniority: SeniorityLevel.Senior,
    responsibilities: '- Drive the development and execution of cutting-edge SEO strategies for optimal search visibility\n' +
      '- Evaluate business impacts of SEO programs by designing/enhancing SEO measurement and reporting capabilities\n' +
      '- Collect and analyze data from various sources and identify opportunities\n' +
      '- Manage 3rd party and SEO agency relationships\n' +
      '- Collaborate with cross-functional business partners (Marketing, Site-Merchandising, Buying, Production, Engineering, UX, and ' +
      'Product) to implement SEO best practices, and leverage cross-functional insights in planning and program development\n' +
      '- Serve as the SEO subject-matter-expert to Site-Merchandising during navigation updates/changes\n' +
      '- Evangelize SEO within the organization and facilitate SEO training sessions to improve cross-functional SEO knowledge and ' +
      'alignment\n' +
      '- Oversee the Local SEO program and work with business partners to optimize local listings\n' +
      '- Collaborate with non-SEO marketing team members to leverage SEO insights\n' +
      '- Perform keyword research, create and implement technical SEO projects, and work on link building strategies\n' +
      '- Conduct competitive and industry analyses to define best practice benchmarking and identify gaps',
    requirements: '- Bachelor’s degree in related field\n' +
      '- 3+ years’ experience in SEO principles (including Local SEO), optimization variables, and metrics\n' +
      '- eCommerce retail SEO experience preferred\n' +
      '- Experience with advanced SEO techniques, tracking/reporting tools, algorithms, analysis and ranking factors\n' +
      '- Experience quantifying marketing and SEO impact, and creating alignment with overall business goals/initiatives\n' +
      '- Strong MS Excel skills including the ability to use formulas, functions, pivot tables and charts\n' +
      '- Experience with web analytics software (e.g., Google Analytics) preferred\n' +
      '- Experience with Conductor, Google Search Console, and web crawling software\n' +
      '- Working knowledge of common programming languages (HTML, CSS, JavaScript, Flash, etc.)\n' +
      '- Strong understanding of technical SEO and proven ability to scope and manage technical projects, while communicating needs to' +
      ' both technical and non-technical stakeholders\n' +
      '- Clear and effective written and verbal communication skills and excellent interpersonal skills\n' +
      '- Self-motivated team player with a positive attitude.\n' +
      '- Ability to see projects through from beginning to end',
    skills: [
      'Management',
      'Match',
      'E-commerce',
      'Match',
      'Marketing',
      'No match',
      'Search Engine Optimization (SEO)',
      'No match',
      'Pivot Tables',
      'No match',
      'Retail',
      'No match',
      'Google Analytics',
      'No match',
      'Communication',
      'No match',
      'Program Development',
      'No match',
      'Fashion'
    ],
  };

  constructor() {
  }

  ngOnInit() {
  }

  getTimePassed() {
    const min = 1000 * 60;
    const hour = 60 * min;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 12 * month;

    const published = this.offer.publishDate.getTime();
    const current = new Date().getTime();

    const difference = current - published;

    if (difference > 2 * year) {
      return Math.round(difference / year) + ' years ago';
    } else if (difference > 2 * month) {
      return Math.round(difference / month) + ' months ago';
    } else if (difference > 2 * week) {
      return Math.round(difference / week) + ' weeks ago';
    } else if (difference > 2 * day) {
      return Math.round(difference / day) + 'days ago';
    } else if (difference > 2 * hour) {
      return Math.round(difference / hour) + 'hours ago';
    } else if (difference > 2 * min) {
      return Math.round(difference / min) + 'minutes ago';
    } else {
      return 'Just now!';
    }
  }

  getOfferStatus() {
    return OfferStatus[this.offer.status];
  }

  getOfferDuration() {
    if (this.offer.isIndefinite) {
      return 'Indefinite';
    } else {
      if (this.offer.duration > 1) {
        return this.offer.duration + ' ' + JobDurationUnit[this.offer.durationUnit];
      } else {
        return this.offer.duration + ' ' + JobDurationUnit[this.offer.durationUnit].slice(0, -1);
      }
    }
  }

  getContractType() {
    return ContractType[this.offer.contractType];
  }
}
