import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { TableDataSource } from '../../../../shared/datasource.component';
import { Course } from '../course.model';
import { CourseService } from '../course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseListResolverGuard implements Resolve<TableDataSource<Course>>  {
  private dataSource: TableDataSource<Course>;
  constructor(private _courseService: CourseService, private router: Router) { }
  // tslint:disable-next-line: max-line-length
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): TableDataSource<Course> | Observable<TableDataSource<Course>> | Promise<TableDataSource<Course>> {

    this.dataSource = new TableDataSource(this._courseService);
    const filter: string = route.queryParamMap.get('filter') || '';
    const pageIndex: number = +route.queryParamMap.get('pageIndex') || 0;
    const pageSize: number = +route.queryParamMap.get('pageSize') || 10;
    return this.dataSource.load(
      filter,
      'id',
      'asc',
      pageIndex,
      pageSize
    ).then((data) => {
        return this.dataSource;
      });
  }
}
