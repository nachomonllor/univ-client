import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../users/user.service';
import { Course } from '../course.model';
import { HttpService } from '../../../../services/http.service';

@Injectable({
  providedIn: 'root'
})
export class CourseSingleResolverGuard implements Resolve<Course>  {
  constructor(private httpService: HttpService, private userService: UserService) {
    this.httpService.url = `/api/subject`;
  }
  // tslint:disable-next-line: max-line-length
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Course | Observable<Course> | Promise<Course> {
    const id: number = +route.paramMap.get('id');
    return this.httpService.getSingle(id);
  }
}
