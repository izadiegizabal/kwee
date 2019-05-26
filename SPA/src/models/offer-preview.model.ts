import {ContractType, JobDurationUnit, SalaryFrequency, WorkLocationType} from './Offer.model';
import {getUrlfiedString} from '../app/shared/utils';

export class OfferPreview {
  public url: string;

  constructor(
    public id: number,
    public title: string,
    public offererIndex: number,
    public offererName: string,
    public offererId: number,
    public location: string,
    public workLocationType: WorkLocationType,
    public datePublished: Date,
    public description: string,
    public isIndefinite: boolean,
    public duration: string,
    public durationUnit: JobDurationUnit,
    public contractType: ContractType,
    public salaryAmount: number,
    public salaryCurrency: string,
    public salaryFrequency: SalaryFrequency,
    public imgPath: string
  ) {
    this.url = window.location.hostname + '/offer/' + id + '/' + getUrlfiedString(title);
  }
}
