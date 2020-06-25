import { TableDataSource } from '../../../../shared/datasource.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StudentService } from '../student.service';
import { Student } from '../student.model';
import { validRoles } from '../../../../utils/enums';

@Injectable()
export class StudentListResolverGuard implements Resolve<TableDataSource<Student>>  {
  private dataSource: TableDataSource<Student>;
  constructor(private _userService: StudentService, private router: Router) {}
  // tslint:disable-next-line: max-line-length
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TableDataSource<Student> | Observable<TableDataSource<Student>> | Promise<TableDataSource<Student>> {
    this.dataSource = new TableDataSource(this._userService);
    const filter: string = route.queryParamMap.get('filter') || '';
    const pageIndex: number = +route.queryParamMap.get('pageIndex') || 0;
    const pageSize: number = +route.queryParamMap.get('pageSize') || 10;
    return this.dataSource.load(
      filter,
      'id',
      'asc',
      pageIndex,
       pageSize,
       [validRoles.Alumno]).then((data) => {
      return this.dataSource;
    });
  }
}
