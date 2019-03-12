import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';
import {getUrlfiedString} from '../../../shared/utils.service';
import {CandidatePreview} from '../../../../models/candidate-preview.model';
import {WorkFields} from '../../../../models/Candidate.model';


@Component({
  selector: 'app-candidate-preview-card',
  templateUrl: './candidate-preview-card.component.html',
  styleUrls: ['./candidate-preview-card.component.scss']
})
export class CandidatePreviewCardComponent implements OnInit {

  @Input() user: CandidatePreview;
  @Input() selectionMode = false;
  @Input() isFaved;
  @Output() changeSelected = new EventEmitter();
  @Output() changeFaved = new EventEmitter();
  faved = false;
  selected = false;


  userUrl: string;


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.userUrl = this.urlfyPosition();
    this.selected = false;
    if (this.isFaved) {
      this.faved = this.isFaved;
    }
  }

  urlfyPosition() {
    return '/candidate/' + this.user.id + '/' + getUrlfiedString(this.user.name);
  }


  openShareDialog() {
    this.dialog.open(SnsShareDialogComponent, {
      data: {
        offer: {title: this.user.name, url: location.hostname + this.urlfyPosition()}
      }
    });
  }

  getWorkfield() {
    // TODO: delete this dirty fix when api returns correctly
    return (WorkFields[this.user.rol]) ? WorkFields[this.user.rol] : 'Designer';
  }

  getAge(dateBorn: string) {
    const ageDifMs = Date.now() - (new Date(dateBorn)).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) + ' y/o';
  }

  // getLatestExperience() {
  //   // TODO: delete this dirty fix when api returns correctly
  //   return (this.user.lastExp) ? this.user.lastExp : 'Facebook';
  // }

  selectCandidate() {
    this.selected = !this.selected;
    this.changeSelected.emit(this.selected);
  }

  getImg() {
    // TODO: delete this dirty fix when api returns correctly
    const defaultImg = '../../../../../assets/img/defaultProfileImg.png';
    return this.user.imgPath ? this.user.imgPath : defaultImg;
  }

  onFaved() {
    this.faved = !this.faved;
    this.changeFaved.emit(this.faved);
  }
}
