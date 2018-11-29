import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-signup-offerer',
  templateUrl: './signup-offerer.component.html',
  styleUrls: ['./signup-offerer.component.scss',
    '../signup-candidate/signup-candidate.component.scss']
})
export class SignupOffererComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  workFields: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Software Engineering'},
    {value: 1, viewValue: 'Engineering Management'},
    {value: 2, viewValue: 'Design'},
    {value: 3, viewValue: 'Data Analitycs'},
    {value: 4, viewValue: 'Developer Operations'},
    {value: 5, viewValue: 'Quality Assurance'},
    {value: 6, viewValue: 'Information Technology'},
    {value: 7, viewValue: 'Project Management'},
    {value: 9, viewValue: 'Product Management'},
  ];

  companySizes: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: '1'},
    {value: 1, viewValue: '2'},
    {value: 2, viewValue: '3'},
    {value: 3, viewValue: '4'},
    {value: 4, viewValue: '5'},
  ];


  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {


    this.firstFormGroup =  this._formBuilder.group({});


    this.secondFormGroup =  this._formBuilder.group({
      'businessName': new FormControl(null, Validators.required),
      'vat': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail':new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z0-9_-ñ]{6,49}$")]),
      'password2': new FormControl(null, Validators.required),
      'workField':new FormControl(null, Validators.required),
      'address1':new FormControl(null, Validators.required),
      'address2':new FormControl(null),
      'city':new FormControl(null, Validators.required),
      'province':new FormControl(null, Validators.required),
      'postalCode':new FormControl(null, Validators.required),
      'country':new FormControl(null, Validators.required),

    });

    this.thirdFormGroup =  this._formBuilder.group({
      'about': new FormControl(),
      'website': new FormControl(),
      'companySize': new FormControl(),
      'year': new FormControl(),
    });



    this.secondFormGroup.controls['password2'].setValidators([
      Validators.required, 
      this.samePassword.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['confEmail'].setValidators([
      Validators.required, 
      this.sameEmail.bind(this.secondFormGroup),
    ]);


    this.secondFormGroup.controls['password'].valueChanges.subscribe(value=>{
      if(this.secondFormGroup.controls['password'].value!=null && this.secondFormGroup.controls['password2'].value!=null){
        this.secondFormGroup.controls['password2'].updateValueAndValidity();
      }
    });


    this.secondFormGroup.controls['email'].valueChanges.subscribe(value=>{
      if(this.secondFormGroup.controls['email'].value!=null && this.secondFormGroup.controls['confEmail'].value!=null){
        this.secondFormGroup.controls['confEmail'].updateValueAndValidity();
      }
    });

  }




  samePassword(control:FormControl):{[s:string]:boolean}{

    const secondFormGroup:any =this;
    if(control.value!==secondFormGroup.controls['password'].value){
      return{same:true};
    }
    return null;
  }



  sameEmail(control:FormControl):{[s:string]:boolean}{

    const secondFormGroup:any =this;
    if(control.value!==secondFormGroup.controls['email'].value){
      return{same:true};
    }
    return null;
  }



  onSubmit(){
    console.log(this.secondFormGroup);
    
  }



}
