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

  constructor(private _formBuilder: FormBuilder) {this.iskill=0;}

  ngOnInit() {

    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup =  this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
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


    this.thirdFormGroup= this._formBuilder.group({
      'bio': new FormControl(null),
      'skills': new FormArray([new FormControl(null)])
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

  onSubmit_form2(){
    console.log(this.thirdFormGroup);
  }  


  add_skill(){
    (<FormArray>this.thirdFormGroup.controls['skills']).push(new FormControl(null));
    this.iskill++;
    console.log(this.formSkills.length);

    setTimeout(()=>{
            document.getElementById(`skill${this.iskill}`).focus();
          }, 1);
  }


  deleteSkill(i){
    (<FormArray>this.thirdFormGroup.controls['skills']).removeAt(i);
    this.iskill--;
  }

  get formSkills(){
    return <FormArray>this.thirdFormGroup.get('skills');
  }

}
