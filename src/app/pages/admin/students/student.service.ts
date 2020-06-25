import { Student } from './student.model';
import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { HttpClient } from '@angular/common/http';
import urljoin from 'url-join';
import { environment } from '../../../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
@Injectable()
export class StudentService extends HttpService{
  constructor(
    public http: HttpClient
  ) {
    super(http);
    this.url = urljoin(environment.apiUrl, '/api/user');
  }
  newStudent(user) {
    return this.add(user)
    .pipe(
      map((response: any) => {
        Swal.fire('Estudiante creado', user.email, 'success');
        return response.user;
      })
    )
    .pipe(
      catchError(err => {
        Swal.fire('Error', err, 'error');
        return throwError(err);
      })
    );
  }

}
