import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { TableDataSource } from '../../../../shared/datasource.component';

import Swal from 'sweetalert2';
import { CourseDetailComponent } from '../course-detail/course-detail.component';
import { Course } from '../course.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { UserService } from '../../users/user.service';
import { NotificationService } from '../../../../services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit, AfterViewInit {
  @Output() coursesEnrolled: EventEmitter<Course[]> = new EventEmitter<Course[]>();
  dataSource: TableDataSource<Course>;
  selected: Course[] = [];
  displayedColumns: string[] = [
    'select',
    'name',
    'period',
    'capacity',
    'active',
    'actions',
  ];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('input', { static: true }) input: ElementRef;
  filter: string;
  selection = new SelectionModel<Course>(true, []);
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private _httpService: HttpService,
  ) {
    _httpService.url = '/api/course';
    // this.dataSource = this.route.snapshot.data['categories'];
    this.route.data.subscribe((data: { courses: TableDataSource<Course> }) => {
      this.dataSource = data.courses;
    });
  }

  ngOnInit() {
    // this.dataSource = this.route.snapshot.data['categories'];
    this.filter = '';
    this.paginator._intl.itemsPerPageLabel = 'Ítems por página: ';
    this.paginator._intl.getRangeLabel = this.spanishRangeLabel;
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.payloadSubject.value.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.payloadSubject.value.forEach(row => this.selection.select(row));
  }

  addElement(element) {
    if (!this.isChecked(element)) {
      this.selected.push(element);
    } else {
      this.selected.splice(this.selected.indexOf(element), 1);
    }
  }
  isChecked(element) {
    return this.selected.includes(element);
  }

  enroll() {
    this.coursesEnrolled.emit(this.selected);
  }
  onCreate() {
    const dialogRef = this.dialog.open(
      CourseDetailComponent,
      this.dialogConfig(),
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPage('asc');
      }
    });
  }
  onEdit(row) {
    const dialogRef = this.dialog.open(
      CourseDetailComponent,
      this.dialogConfig(row),
    );
    dialogRef.afterClosed().subscribe((result) => {
      this.loadPage(this.sort.direction);
    });
  }
  onDelete(id) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Estás a punto de desactivar un Rol',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desactivar!',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this._httpService.delete<Course>(id).subscribe(
          (resp: any) => {
            this.notificationService.success(
              'El rol seleccionado ha sido Eliminado',
            );
            this.loadPage();
          },
          (err) => {
            console.log(err);
            Swal.fire({
              title: 'Reglas de Validación',
              text: err,
              icon: 'error',
              showConfirmButton: false,
              timer: 2000,
              animation: false,
            });
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
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => {
        this.loadPage();
      }))
      .subscribe();
  }
  loadPage(direction = this.sort.direction) {
    this.router.navigated = false;
    // tslint:disable-next-line: max-line-length
    this.router.navigate(['/courses'],
      {
        queryParams:
        {
          filter: this.input.nativeElement.value,
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize
        }
      }).then(() => {
        // console.log(this.route.snapshot.data.categories);
      });
    // this.dataSource.load(
    //   this.input.nativeElement.value,
    //   this.sort.active,
    //   direction,
    //   this.paginator.pageIndex,
    //   this.paginator.pageSize,
    //   this.userService.token,
    // );
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
