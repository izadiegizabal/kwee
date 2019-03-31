import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {SnsShareDialogComponent} from '../../../shared/sns-share/sns-share-dialog/sns-share-dialog.component';
import {getUrlfiedString} from '../../../shared/utils.service';
import {CandidatePreview} from '../../../../models/candidate-preview.model';
import {WorkFields} from '../../../../models/Candidate.model';
import {environment} from '../../../../environments/environment';
import {AlertDialogComponent} from '../../../shared/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-candidate-preview-card',
  templateUrl: './candidate-preview-card.component.html',
  styleUrls: ['./candidate-preview-card.component.scss']
})
export class CandidatePreviewCardComponent implements OnInit {

  @Input() user: CandidatePreview;
  @Input() selectionMode = false;
  @Input() applicationStatus = -1;
  @Input() isFaved;
  @Output() changeSelected = new EventEmitter();
  @Output() changeFaved = new EventEmitter();
  @Output() changeRejected = new EventEmitter();
  faved = false;
  selected = false;
  rejected = false;


  userUrl: string;


  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.user.applicationStatus === 1) {  // if application status is 1 -> faved
      this.faved = true;
    }

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
    const dialogSelect = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to select this user?',
      }
    });

    dialogSelect.afterClosed().subscribe(result => {
      if (result) {
        this.selected = true;
        this.changeSelected.emit(this.selected);
      }
    });
  }

  getImg() {
    const defaultImg = '../../../../../assets/img/defaultProfileImg.png';
    if (this.user.img) {
      return environment.apiUrl + 'image/applicants/' + this.user.img;
    } else {
      return defaultImg;
    }
  }

  onFaved() {
    this.faved = !this.faved;
    this.changeFaved.emit(this.faved);
  }

  rejectCandidate() {
    const dialogSelect = this.dialog.open(AlertDialogComponent, {
      data: {
        header: 'Are you sure you want to reject this user?',
      }
    });

    dialogSelect.afterClosed().subscribe(result => {
      if (result) {
        this.rejected = true;
        this.changeRejected.emit(this.rejected);
      }
    });

  }

  getApplicationStatus() {
    switch (this.applicationStatus) {
      case 0:
        return 'Pending';
      case 1:
        return 'Faved';
      case 2:
        return 'Selected';
      case 3:
        return 'Accepted';
      case 4:
        return 'Refused';
      default:
        return 'IDK';
    }
  }

  getColor() {
    switch (this.applicationStatus) {
      case 3:
        return 'accent';
      case 4:
        return 'warn';
      default:
        return 'primary';
    }
  }

  contactUser() {
    if (this.user.email) {
      const href = 'mailto:' + this.user.email + '?subject=Enquiry about your Kwee Profile';
      location.href = href;
    }
  }
}
