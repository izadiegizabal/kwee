import {BusinessAccountStates, BusinessIndustries, BusinessSize, BusinessAccountSubscriptions} from './Business.model';
import {getUrlfiedString} from '../app/shared/utils.service';

export class BusinessPreview {
  public url;

  constructor(
    public id: number,
    public index: number,
    public name: string,
    public bio: string,
    public address: string,
    public year: Date,
    public workfield: BusinessIndustries,
    public img: string,
    public email: string,
    public lastAccess: Date,
    public createdAt: Date,
    public status: BusinessAccountStates,
    public premium: BusinessAccountSubscriptions,
    public companySize: BusinessSize,
  ) {
    this.url = window.location.hostname + '/business/' + id + '/' + getUrlfiedString(name);
  }
}
