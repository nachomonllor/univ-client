import { InscriptionsComponent } from './inscriptions.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyTokenGuard } from '../../../services/guards/verify-token.guard';
import { CourseListResolverGuard } from '../../admin/courses/course-list/course-list-resolver.guard';

const routes: Routes = [
  {
    path: '',
    component: InscriptionsComponent,
    canActivateChild: [VerifyTokenGuard],
    data: { titulo: 'Inscripción de Materias' },
    runGuardsAndResolvers: 'always',
    resolve: { courses: CourseListResolverGuard }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InscriptionsRoutingModule { }
