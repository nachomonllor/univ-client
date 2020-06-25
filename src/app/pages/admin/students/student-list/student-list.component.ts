import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { StudentDetailComponent } from '../student-detail/student-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../services/notification.service';
import { StudentService } from '../student.service';
import { TableDataSource } from '../../../../shared/datasource.component';
import { Student } from '../student.model';


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, AfterViewInit {
  dataSource: TableDataSource<Student>;
  displayedColumns: string[] = [
    'img',
    'fullname',
    'lastname',
    'email',
    'roles',
    'active',
    'actions',
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('input', { static: true }) input: ElementRef;
  filter: string;
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public notificationService: NotificationService,
    public _studentService: StudentService,
  ) {
    // _studentService.url = '/api/student';
    // this.dataSource = this.route.snapshot.data['students'];
    this.route.data.subscribe((data: {students: TableDataSource<Student>}) => {
      this.dataSource = data.students;
    });
  }

  ngOnInit() {
    // this.dataSource = this.route.snapshot.data['students'];

    this.filter = '';
    // this.paginator._intl.itemsPerPageLabel = 'Ítems por página: ';
    // this.paginator._intl.getRangeLabel = this.spanishRangeLabel;
  }
  onCreate() {
    const dialogRef = this.dialog.open(
      StudentDetailComponent,
      this.dialogConfig(),
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPage();
      }
    });
  }
  onEdit(row) {
    const dialogRef = this.dialog.open(
      StudentDetailComponent,
      this.dialogConfig(row),
    );
    dialogRef.afterClosed().subscribe(() => {
      this.loadPage();
    });
  }
  onDelete(id) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Estás a punto de desactivar un Estudiante',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desactivar!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._studentService.delete<Student>(id).subscribe(
          () => {
            this.notificationService.success(
              'El usuario seleccionado ha sido Eliminado',
            );
            debugger
            this.loadPage();
          },
          (err) => {
            console.log(err);
            // Swal.fire({
            //   title: 'Reglas de Validación',
            //   text: err,
            //   icon: 'error',
            //   showConfirmButton: false,
            //   timer: 2000,
            //   animation: false,
            // });
          },
        );
      }
    });
  }
  onSearchClear() {
    if (this.input.nativeElement.value.length > 0) {
      this.input.nativeElement.value = '';
      this.loadPage();
    }
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
          this.filter = this.input.nativeElement.value;
        }),
      )
      .subscribe();
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // this.paginator.page.pipe(tap(() => {
    //   debugger
    //   this.loadPage();
    // })).subscribe();
    // on sort or paginate events, load a new page

    // merge(this.sort.sortChange, this.paginator.page)
    //   .pipe(tap(() => {
    //     this.loadPage();
    //   }))
    //   .subscribe();
  }
  loadPage() {
    this.router.navigated = false;
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/students'],
      { queryParams:
        {
          filter: this.input.nativeElement.value,
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize
        }
      }).then(() => {
        // console.log(this.route.snapshot.data.students);
      });
  }

  dialogConfig(data?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = data || null;
    return dialogConfig;
  }
  spanishRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 de ${length}`; }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  }
}
