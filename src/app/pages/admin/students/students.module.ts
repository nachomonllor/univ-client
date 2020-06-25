import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentsRoutingModule } from './students-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { StudentService } from './student.service';
import { MaterialModule } from '../../../shared/material.module';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { NotificationService } from '../../../services/notification.service';
import { StudentsComponent } from './students.component';
import { StudentListResolverGuard } from './student-list/student-list-resolver.guard';
import { PipesModule } from '../../../pipes/pipes.module';
import { RolesModule } from '../roles/roles.module';
import { CoursesModule } from '../courses/courses.module';

@NgModule({
  declarations: [
    StudentsComponent,
    StudentListComponent,
    StudentDetailComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    StudentsRoutingModule,
    PipesModule,
    RouterModule,
    RolesModule,
    CoursesModule
  ],
  exports: [],
  providers: [StudentService, NotificationService, StudentListResolverGuard]
})
export class StudentsModule {}
