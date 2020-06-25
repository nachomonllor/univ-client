import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentsComponent } from './students.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { VerifyTokenGuard } from '../../../services/guards/verify-token.guard';
import { StudentListResolverGuard } from './student-list/student-list-resolver.guard';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    canActivateChild: [VerifyTokenGuard],
    data: { titulo: 'Gestión de Alumnos' },
    children: [
      { path: '', component: StudentListComponent, runGuardsAndResolvers: 'always', resolve: { students: StudentListResolverGuard } },
      { path: 'new', component: StudentDetailComponent },
      { path: ':id', component: StudentDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
