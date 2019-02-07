import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialog-image-crop',
  templateUrl: './dialog-image-crop.component.html',
  styleUrls: ['./dialog-image-crop.component.scss']
})
export class DialogImageCropComponent {

  imageChangedEvent: any = '';
  croppedImage: any = '';

  control = new FormControl(null);

  constructor(
    public dialogRef: MatDialogRef<DialogImageCropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.fileChangeEvent(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
    console.log(event);
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

}
