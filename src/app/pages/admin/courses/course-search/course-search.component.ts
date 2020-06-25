import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ComboSearchComponent } from '../../../../shared/combo-search/combo-search.component';

import { UserService } from '../../users/user.service';
import { Course } from '../course.model';
import _ from 'lodash';
import { HttpService } from '../../../../services/http.service';
import { CourseService } from '../course.service';
import { User } from '../../users/user.model';

@Component({
  selector: 'app-course-search',
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.scss']
})
export class CourseSearchComponent extends ComboSearchComponent<Course> {
  selected: string;
  @Input() isMultiple = true;
  @Output() courseChanged = new EventEmitter<User[]>();
  constructor(public _courseService: CourseService) {
    super(_courseService, false);
  }
  onSelectionChange(evt) {
    const selected = _.filter(this.payload, (el) => {
      return el.id === evt.value;
    });
    this.courseChanged.emit(selected[0]);
  }
}
