import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, FormArray} from '@angular/forms';

@Component({
  selector: 'app-signup-candidate',
  templateUrl: './signup-candidate.component.html',
  styleUrls: ['./signup-candidate.component.scss']
})
export class SignupCandidateComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  iskill=0;

  roles: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Designer'},
    {value: 1, viewValue: 'Front-end Developer'},
    {value: 2, viewValue: 'Back-end Developer'},
    {value: 3, viewValue: 'Tester'},
    {value: 4, viewValue: 'Product Manager'},
  ];

  constructor(private _formBuilder: FormBuilder) {this.iskill=0; console.log(this.iskill)}

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup =  this._formBuilder.group({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail':new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z0-9_-ñ]{6,49}$")]),
      'password2': new FormControl(null, Validators.required),
      'birthday':new FormControl(null, Validators.required),
      'location':new FormControl(null, Validators.required),
      'role':new FormControl(null, Validators.required),
    
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


    //T
    this.thirdFormGroup= this._formBuilder.group({
      'bio': new FormControl(null),
      'skills': new FormArray([new FormControl(null)])
    });



  }



  samePassword(control:FormControl):{[s:string]:boolean}{

    let secondFormGroup:any =this;
    if(control.value!==secondFormGroup.controls['password'].value){
      return{same:true};
    }
    return null;
  }


  sameEmail(control:FormControl):{[s:string]:boolean}{
    
    let secondFormGroup:any =this;
    if(control.value!==secondFormGroup.controls['email'].value){
      return{same:true};
    }
    return null;
  }



  onSubmit(){
    console.log(this.secondFormGroup);
    
  }  

  onSubmit_form2(){
    console.log(this.thirdFormGroup);
  }  


   add_skill(){
    (<FormArray>this.thirdFormGroup.controls['skills']).push(new FormControl(null));
    this.iskill++;
       
    setTimeout(()=>{
            document.getElementById(`skill${this.iskill}`).focus();
          }, 20);
  }


}
