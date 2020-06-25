import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import urlJoin from 'url-join';
import { Subscription } from 'rxjs';
import { Course } from '../course.model';
import { NotificationService } from '../../../../services/notification.service';
import { CourseService } from '../course.service';

declare var $: any;
@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  Course: Course;
  CourseSubscription: Subscription = new Subscription();
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required),
    capacity: new FormControl(30, Validators.required),
    active: new FormControl(true),
  });
  constructor(
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<CourseDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _httpService: CourseService,
  ) {
    if (data) {
      this.populateForm(data);
    }
  }
  ngOnDestroy() {
    this.CourseSubscription.unsubscribe();
  }
  ngOnInit() {}
  onClear() {
    this.onClose();
  }
  onClose(refresh?) {
    this.dialogRef.close(refresh);
  }
  onSubmit() {
    if (this.form.valid) {
      if (!this.form.get('id').value) {
        this._httpService.add<Course>(this.form.value).subscribe(
          (resp: any) => {
            this.onClose(true);
            this.notificationService.success(':: La materia ha sido creada');
          },
          (err) => {
            this.notificationService.error(`:: ${err}`);
          },
        );
      } else {
        this._httpService.update<Course>(this.form.value).subscribe(
          (Course) => {
            this.onClose(true);
            this.notificationService.success(
              ':: La especialidad ha sido actualizado',
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
    this.CourseSubscription = this._httpService
      .getSingle<Course>(data.id)
      .subscribe((res: any) => {
        this.Course = res.payload;
        this.form.get('id').setValue(this.Course.id);
        this.form.get('name').setValue(this.Course.name);
        this.form.get('active').setValue(this.Course.active);
      }, err => this.notificationService.error(`:: ${err}`));
  }
}
