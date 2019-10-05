import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatInput} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  semestersSoFar: number;
  semesterList: any[];
  result: number;
  avg: number;

  // tslint:disable-next-line:variable-name
  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.initialiseForm();
  }

  initialiseForm() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
          Validators.pattern('^[0-9]*$')
        ]
      ]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: []
    });
    this.thirdFormGroup = this._formBuilder.group({
      expectedCgpa: [
        '',
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
          Validators.pattern('[0-9](.[0-9][0-9]?)?')
        ]
      ],
      expectedSemester: ['']
    });
  }

  gotSemesters() {
    this.semestersSoFar = this.firstFormGroup.value.firstCtrl;
    // const semestersSoFar = this.firstFormGroup.value.firstCtrl;
    this.thirdFormGroup.controls.expectedSemester.setValidators([
      Validators.min(this.semestersSoFar + 1),
      Validators.max(10),
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]);
    this.thirdFormGroup.controls.expectedSemester.updateValueAndValidity();


    let semestersCgpasGroup = {};
    for (let i = 1; i <= this.semestersSoFar; i++) {
      semestersCgpasGroup = {
        ...semestersCgpasGroup,
        [i]: [
          '',
          [
            Validators.required,
            Validators.min(1),
            Validators.max(10),
            Validators.pattern('[0-9](.[0-9][0-9]?)?')
          ],
        ]
      };
    }
    let secondForm = {semesters: this._formBuilder.group(semestersCgpasGroup)};
    if (this.semestersSoFar > 1) {
      const avg = {
        ['avg']: [
          '',
          [
            Validators.required,
            Validators.min(1),
            Validators.max(10),
            Validators.pattern('[0-9](.[0-9][0-9]?)?')
          ]
        ]
      };
      secondForm = {
        ...secondForm,
        ...avg
      };
    }
    // this.secondFormGroup = this._formBuilder.group(this.semestersCgpas);
    this.secondFormGroup = this._formBuilder.group(secondForm);
    this.semesterList = Object.keys(semestersCgpasGroup);
    // console.log('second form group creation', this.secondFormGroup, 'semester list', this.semesterList);
    this.onChanges();
  }

  onChanges() {
    if (this.semestersSoFar > 1) {
      this.secondFormGroup.get('avg').valueChanges.subscribe(avg => {
        if (avg) {
          this.secondFormGroup.get('semesters').disable({emitEvent: false});
        } else {
          this.secondFormGroup.get('semesters').enable({emitEvent: false});
        }
      });
      this.secondFormGroup.get('semesters').valueChanges.subscribe(val => {
        let disableAvg = false;
        Object.keys(val).forEach(sem => {
          disableAvg = disableAvg || !!val[sem];
        });
        if (disableAvg) {
          this.secondFormGroup.get('avg').disable({emitEvent: false});
        } else {
          this.secondFormGroup.get('avg').enable({emitEvent: false});
        }
      });
    }
  }

  gotCgpas() {
    // console.log('second form', this.secondFormGroup);
  }

  gotExpectedData() {
    let semestersCgpas;
    const expectedGPA = this.thirdFormGroup.value.expectedCgpa;
    const expectedSem = this.thirdFormGroup.value.expectedSemester;
    let sum = 0;
    if (this.semestersSoFar > 1 && this.secondFormGroup.value.avg) {
      this.avg = this.secondFormGroup.value.avg;
      sum = this.avg * this.semestersSoFar;
    } else {
      semestersCgpas = this.secondFormGroup.value.semesters;
      Object.keys(semestersCgpas).forEach((sem: any) => {
        if (sem !== 'avg') {
          sum += parseFloat(semestersCgpas[sem]);
        }
      });
      this.avg = sum / this.semestersSoFar;
    }
    this.result =
      (expectedGPA * expectedSem - sum) / (expectedSem - this.semestersSoFar);
    this.result = parseFloat(this.result.toFixed(2));
  }
}
