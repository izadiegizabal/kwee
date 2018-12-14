import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SingupService} from '../signup.service';
import {MatDialog, MatStepper} from '@angular/material';
import {Action, Store} from '@ngrx/store';
import * as fromApp from '../../../store/app.reducers';
import * as AuthActions from '../../store/auth.actions';
import {AuthEffects} from '../../store/auth.effects';
import {filter} from 'rxjs/operators';
import {DialogErrorComponent} from '../dialog-error/dialog-error.component';

@Component({
  selector: 'app-signup-candidate',
  templateUrl: './signup-candidate.component.html',
  styleUrls: ['./signup-candidate.component.scss'],
})
export class SignupCandidateComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  candidate: any;

  hide = false;
  iskill = 0;
  iskillang = 0;
  iskilex = 0;
  iskiled = 0;

  roles: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Software Engineering'},
    {value: 1, viewValue: 'Engineering Management'},
    {value: 2, viewValue: 'Design'},
    {value: 3, viewValue: 'Data Analytics'},
    {value: 4, viewValue: 'Developer Operations'},
    {value: 5, viewValue: 'Quality Assurance'},
    {value: 6, viewValue: 'Information Technology'},
    {value: 7, viewValue: 'Project Management'},
    {value: 8, viewValue: 'Product Management'},
  ];

  proficiencies: { value: number, viewValue: string }[] = [
    {value: 0, viewValue: 'Proficiency'},
    {value: 1, viewValue: 'Begginer - A1'},
    {value: 2, viewValue: 'Elementary - A2'},
    {value: 3, viewValue: 'Intermediate - B1'},
    {value: 4, viewValue: 'Upper Intermediate - B2'},
    {value: 5, viewValue: 'Advanced - C1'},
    {value: 6, viewValue: 'Proficient - C2'},
    {value: 7, viewValue: 'Native'},
  ];

  constructor(private _formBuilder: FormBuilder,
              private _singupService: SingupService,
              public dialog: MatDialog,
              private store: Store<fromApp.AppState>, private authEffects: AuthEffects) {
    this.iskill = 0;
    this.iskillang = 0;
    this.iskilex = 0;
    this.iskiled = 0;
  }

  get formSkills() {
    return <FormArray>this.thirdFormGroup.get('skills');
  }

  get formLanguages() {
    return <FormArray>this.thirdFormGroup.get('languages');
  }

  get formExperience() {
    return <FormArray>this.thirdFormGroup.get('experience');
  }

  get formEducation() {
    return <FormArray>this.thirdFormGroup.get('education');
  }

  getProf(n: number) {
    return this.proficiencies[n].viewValue;
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      'name': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'confEmail': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.pattern('[a-zA-Z0-9_-ñ]{6,49}$')]),
      'password2': new FormControl(null, Validators.required),
      'birthday': new FormControl(null, Validators.required),
      'location': new FormControl(null, Validators.required),
      'role': new FormControl(null, Validators.required),
    });

    this.secondFormGroup.controls['password2'].setValidators([
      Validators.required,
      this.samePassword.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['confEmail'].setValidators([
      Validators.required,
      this.sameEmail.bind(this.secondFormGroup),
    ]);

    this.secondFormGroup.controls['birthday'].setValidators([
      Validators.required,
      this.minDate.bind(this.secondFormGroup),
    ]);


    this.secondFormGroup.controls['password'].valueChanges.subscribe(value => {
      this.secondFormGroup.controls['password2'].updateValueAndValidity();
    });


    this.secondFormGroup.controls['email'].valueChanges.subscribe(value => {
      if (this.secondFormGroup.controls['email'].value != null && this.secondFormGroup.controls['confEmail'].value != null) {
        this.secondFormGroup.controls['confEmail'].updateValueAndValidity();
      }
    });


    this.thirdFormGroup = this._formBuilder.group({
      'bio': new FormControl(null),
      'skills': new FormArray([new FormControl(null)]),
      'languages': this._formBuilder.array([// new FormGroup({
        // 'language': new FormControl(null),
        // 'proficiency': new FormControl(null)
        // })
        this.addLanguageGroup()
      ]),
      'experience': this._formBuilder.array([
        this.addExperienceGroup()
      ]),
      'education': this._formBuilder.array([
        this.addEducationGroup()
      ])
    });
  }

  addLanguageGroup(): FormGroup {
    return this._formBuilder.group({
      'language': new FormControl(null),
      'proficiency': new FormControl(null)
    });
  }

  addExperienceGroup(): FormGroup {
    return this._formBuilder.group({
      'title': new FormControl(null),
      'company': new FormControl(null),
      'start': new FormControl(null),
      'end': new FormControl(null),
      'description': new FormControl(null)
    });
  }

  addEducationGroup(): FormGroup {
    return this._formBuilder.group({
      'title': new FormControl(null),
      'institution': new FormControl(null),
      'start': new FormControl(null),
      'end': new FormControl(null),
      'description': new FormControl(null)
    });
  }

  samePassword(control: FormControl): { [s: string]: boolean } {
    const secondFormGroup: any = this;
    if (control.value !== secondFormGroup.controls['password'].value) {
      return {same: true};
    }
    return null;
  }

  sameEmail(control: FormControl): { [s: string]: boolean } {
    const secondFormGroup: any = this;
    if (control.value !== secondFormGroup.controls['email'].value) {
      return {same: true};
    }
    return null;
  }

  minDate(control: FormControl): { [s: string]: boolean } {
    const today = new Date();
    const mdate = new Date(`${today.getFullYear() - 16}/${today.getMonth()}/${today.getDay()}`);

    if (control.value > mdate) {
      return {ok: true};
    }
    return null;
  }

  onSave(stepper: MatStepper) {
    // console.log(this.secondFormGroup);

    if (this.secondFormGroup.status === 'VALID') {

      this.candidate = {
        'name': this.secondFormGroup.controls['name'].value,
        'password': this.secondFormGroup.controls['password'].value,
        'email': this.secondFormGroup.controls['email'].value,
        'city': this.secondFormGroup.controls['location'].value,
        'dateBorn': this.secondFormGroup.controls['birthday'].value,
        'premium': '0',
        'rol': this.secondFormGroup.controls['role'].value
      };

      // console.log(this.candidate);
      this.store.dispatch(new AuthActions.TrySignupCandidate(this.candidate));
      this.authEffects.authSignin.pipe(
        filter((action: Action) => action.type === AuthActions.SIGNIN)
      ).subscribe(() => {
        stepper.next();
      });
      this.authEffects.authSignupCandidate.pipe(
        filter((action: Action) => action.type === AuthActions.AUTH_ERROR)
      ).subscribe((error: { payload: any, type: string }) => {
        console.log(error.payload);
        this.dialog.open(DialogErrorComponent);
      });

      // this._singupService.newApplicant(this.candidate)
      //   .subscribe(
      //     (response) => {
      //       console.log(response);
      //       stepper.next();
      //     },
      //     (error) => {
      //       // console.log(error);
      //       const dialogRef = this.dialog.open(DialogErrorComponent);
      //     }
      //   );
    }
  }

  onSubmit_form2() {
    console.log(this.thirdFormGroup);
  }

  add_skill() {
    (<FormArray>this.thirdFormGroup.controls['skills']).push(new FormControl(null));
    this.iskill++;
    console.log(this.formSkills.length);

    setTimeout(() => {
      document.getElementById(`skill${this.iskill}`).focus();
    }, 1);
  }

  addLanguage() {
    (<FormArray>this.thirdFormGroup.controls['languages']).push(this.addLanguageGroup());
    this.iskillang++;
    console.log(this.formLanguages);

    // setTimeout(() => {
    // document.getElementById(`language${this.iskillang}`).focus();
    // }, 1);
  }

  addExperience() {
    (<FormArray>this.thirdFormGroup.controls['experience']).push(this.addExperienceGroup());
    this.iskilex++;
    console.log(this.formExperience.value);
  }

  addEducation() {
    (<FormArray>this.thirdFormGroup.controls['education']).push(this.addEducationGroup());
    this.iskiled++;
    console.log(this.formEducation.value);
  }


  deleteSkill(i) {
    (<FormArray>this.thirdFormGroup.controls['skills']).removeAt(i);
    this.iskill--;
  }

  deleteLanguage(i) {
    (<FormArray>this.thirdFormGroup.controls['languages']).removeAt(i);
    this.iskillang--;
  }

  deleteExperience(i) {
    (<FormArray>this.thirdFormGroup.controls['experience']).removeAt(i);
    this.iskilex--;
  }

  deleteEducation(i) {
    (<FormArray>this.thirdFormGroup.controls['education']).removeAt(i);
    this.iskiled--;
  }

  onChange(e, s) {
    if (e.checked) {
      document.getElementById(`toEx${s}`).setAttribute('disabled', 'true');
    } else {
      document.getElementById(`toEx${s}`).removeAttribute('disabled');
    }
  }

  onChangeEd(e, s) {
    if (e.checked) {
      document.getElementById(`toEd${s}`).setAttribute('disabled', 'true');
    } else {
      document.getElementById(`toEd${s}`).removeAttribute('disabled');
    }

  }

}
