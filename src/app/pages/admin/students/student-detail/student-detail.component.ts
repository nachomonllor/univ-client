import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { Subscription } from 'rxjs';
import { Student } from '../student.model';
import { NotificationService } from '../../../../services/notification.service';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})

export class StudentDetailComponent implements OnInit, OnDestroy {
  student: Student;
  studentSubscription: Subscription = new Subscription();
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    fullname: new FormControl(null, Validators.required),
    lastname: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    confirmPassword: new FormControl(null, Validators.required),
    genre: new FormControl('1', Validators.required),
    enrollment: new FormControl(null, Validators.required),
    birthDate: new FormControl(null, Validators.required),
    active: new FormControl(true),
  });
  constructor(
    private notificationService: NotificationService,
    private _studentService: StudentService,
    private dialogRef: MatDialogRef<StudentDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}
  ngOnDestroy() {
    this.studentSubscription.unsubscribe();
  }
  ngOnInit() { }
  onClear() {
    this.onClose();
  }
  onClose(refresh?) {
    this.dialogRef.close(refresh);
  }
  onSubmit() {
    if (this.form.valid) {
      if (!this.form.get('id').value) {
        this._studentService.add<Student>(this.form.value).subscribe(
          () => {
            this.onClose(true);
            this.notificationService.success(':: El usuario ha sido creado');
            this.router.navigate(['/students'])
          },
          (err) => {
            this.notificationService.error(`:: ${err}`);
          },
        );
      } else {
        this._studentService.update<Student>(this.form.value).subscribe(
          () => {
            this.onClose(true);
            this.notificationService.success(
              ':: El usuario ha sido actualizado',
            );
          },
          (err) => {
            this.notificationService.error(`:: ${err}`);
          },
        );
      }
    }
  }
  initializeFormGroup() {
    this.form.setValue({
      id: null,
      description: '',
      active: true,
    });
  }
  populateForm(data) {
    this.studentSubscription = this._studentService
      .getSingle<Student>(data.id)
      .subscribe((res: any) => {
        this.student = res.payload;
      });
  }
  onSelectionChange() {
  }
}