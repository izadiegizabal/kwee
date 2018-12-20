import {Component, OnInit} from '@angular/core';
import {
  ContractType,
  JobDurationUnit,
  Offer,
  OfferStatus,
  SalaryFrequency,
  SeniorityLevel,
  WorkLocationType
} from '../../../models/Offer.model';
import {UtilsService} from '../utils.service';

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
    salaryFrequency: SalaryFrequency['per month'],
    workLocation: WorkLocationType.Remote,
    seniority: SeniorityLevel.Senior,
    applications: 5,
    responsibilities: '- Drive the development and execution of cutting-edge SEO strategies for optimal search visibility .\n' +
      '- Evaluate business impacts of SEO programs by designing/enhancing SEO measurement and reporting capabilities.\n' +
      '- Collect and analyze data from various sources and identify opportunities.\n' +
      '- Manage 3rd party and SEO agency relationships.\n' +
      '- Collaborate with cross-functional business partners (Marketing, Site-Merchandising, Buying, Production, Engineering, UX, and ' +
      'Product) to implement SEO best practices, and leverage cross-functional insights in planning and program development.\n' +
      '- Serve as the SEO subject-matter-expert to Site-Merchandising during navigation updates/changes.\n' +
      '- Evangelize SEO within the organization and facilitate SEO training sessions to improve cross-functional SEO knowledge and ' +
      'alignment.\n' +
      '- Oversee the Local SEO program and work with business partners to optimize local listings.\n' +
      '- Collaborate with non-SEO marketing team members to leverage SEO insights.\n' +
      '- Perform keyword research, create and implement technical SEO projects, and work on link building strategies.\n' +
      '- Conduct competitive and industry analyses to define best practice benchmarking and identify gaps.',
    requirements: '- Bachelor’s degree in related field.\n' +
      '- 3+ years’ experience in SEO principles (including Local SEO), optimization variables, and metrics.\n' +
      '- eCommerce retail SEO experience preferred.\n' +
      '- Experience with advanced SEO techniques, tracking/reporting tools, algorithms, analysis and ranking factors.\n' +
      '- Experience quantifying marketing and SEO impact, and creating alignment with overall business goals/initiatives.\n' +
      '- Strong MS Excel skills including the ability to use formulas, functions, pivot tables and charts.\n' +
      '- Experience with web analytics software (e.g., Google Analytics) preferred.\n' +
      '- Experience with Conductor, Google Search Console, and web crawling software.\n' +
      '- Working knowledge of common programming languages (HTML, CSS, JavaScript, Flash, etc.).\n' +
      '- Strong understanding of technical SEO and proven ability to scope and manage technical projects, while communicating needs to' +
      ' both technical and non-technical stakeholders.\n' +
      '- Clear and effective written and verbal communication skills and excellent interpersonal skills.\n' +
      '- Self-motivated team player with a positive attitude.\n' +
      '- Ability to see projects through from beginning to end.',
    skills: [
      'Management',
      'E-commerce',
      'Marketing',
      'Search Engine Optimization (SEO)',
      'Pivot Tables',
      'Retail',
      'Google Analytics',
      'Communication',
      'Program Development',
      'Fashion'
    ],
  };

  constructor(private _utils: UtilsService) {
  }

  ngOnInit() {
  }

  getTimePassed() {
    return this._utils.getTimePassed(this.offer.publishDate);
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

  getOfferContractType() {
    return ContractType[this.offer.contractType];
  }

  getOfferSeniorityLevel() {
    return SeniorityLevel[this.offer.seniority] + ' Position';
  }

  getOfferSalary() {
    return this.offer.salaryAmount + this.offer.salaryCurrency + ' ' + SalaryFrequency[this.offer.salaryFrequency];
  }

  getOfferLocation() {
    let location = this.offer.location ? this.offer.location : '';
    if (location !== '' && this.offer.workLocation !== WorkLocationType['On Site']) {
      location += ' - ';
      location += WorkLocationType[this.offer.workLocation];
    } else if (location === '') {
      location = WorkLocationType[this.offer.workLocation];
    }

    return location;
  }

  getOfferApplications() {
    const numOfApplications = this.offer.applications;
    return numOfApplications + (numOfApplications === 1 ? ' application' : ' applications');
  }
}
