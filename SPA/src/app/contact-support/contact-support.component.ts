import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';


@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent implements OnInit {

  messageFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.messageFormGroup = this._formBuilder.group({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'resume': new FormControl(null, Validators.required),
      'text': new FormControl(null, Validators.required),
    });
  }


  sendMessage() {
    console.log(this.messageFormGroup.value);

    // this.httpClient.post(environment.apiUrl + 'message', this.messageFormGroup.value)
    //   .subscribe((data: any) => {
    //     console.log(data);
    //     this.router.navigate(['/']);
    //   }, (error: any) => {
    //     console.log(error);
    //     /*if (!this.dialogShown) {
    //       this.dialog.open(DialogErrorComponent, {
    //         data: {
    //           error: 'We had some issue creating your offer. Please try again later',
    //         }
    //       });
    //       this.dialogShown = true;
    //     }*/
    // });
  }

}
