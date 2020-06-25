import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseListResolverGuard } from './course-list/course-list-resolver.guard';
import { CourseSingleResolverGuard } from './course-detail/course-single-resolver.guard';
import { VerifyTokenGuard } from '../../../services/guards/verify-token.guard';

const routes: Routes = [
  {
    path: '',
    component: CoursesComponent,
    canActivateChild: [VerifyTokenGuard],
    data: { titulo: 'Gestión de Materias' },
    children: [
      {
        path: '',
        component: CourseListComponent,
        runGuardsAndResolvers: 'always',
        resolve: { courses: CourseListResolverGuard }
      },
      { path: 'new', component: CourseDetailComponent },
      { path: ':id', component: CourseDetailComponent, resolve: { Course: CourseSingleResolverGuard } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
