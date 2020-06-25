import {
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionService } from './inscription.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-inscriptions',
  templateUrl: './inscriptions.component.html'
})
export class InscriptionsComponent implements OnInit {
  constructor(public _inscriptionService: InscriptionService) {}
  ngOnInit() {}
  coursesEnrolled(evt) {
    const courses = evt.map(c => c.id);
    this._inscriptionService.add(courses).subscribe(data => {
      Swal.fire(
        'Inscripción',
        'Felicitaciones, se ha aprobado tu inscripción',
        'success'
      );
    }, err => {
      Swal.fire(
        'Error',
        err,
        'error'
      );
    })
  }
}
