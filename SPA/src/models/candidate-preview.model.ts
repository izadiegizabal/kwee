import {CandidateAccountStatus, WorkFields} from './Candidate.model';
import {getUrlfiedString} from '../app/shared/utils';

export class CandidatePreview {
  public url;

  constructor(
    public id: number,
    public applicationId: number = -1,
    public applicationStatus: number = -1,
    public index: number,
    public avg: any,
    public name: string,
    public bio: string,
    public city: string,
    public dateBorn: Date,
    public rol: WorkFields,
    public img: string,
    public lastExp: string, // name of the business they worked in
    // for admin purposes
    public email: string,
    public lastAccess: Date,
    public createdAt: Date,
    public status: CandidateAccountStatus,
    public premium: boolean
  ) {
    this.url = window.location.hostname + '/candidate/' + id + '/' + getUrlfiedString(name);
  }
}
