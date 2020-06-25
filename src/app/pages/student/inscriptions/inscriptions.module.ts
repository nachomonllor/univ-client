import { CoursesModule } from './../../admin/courses/courses.module';
import { InscriptionsRoutingModule } from './inscriptions-routing.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { InscriptionsComponent } from './inscriptions.component';

import { SharedModule } from '../../../shared/shared.module';

import { InscriptionService } from './inscription.service';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InscriptionsRoutingModule,
    CoursesModule
  ],
  declarations: [
    InscriptionsComponent,
  ],
  exports: [

  ],
  providers: [InscriptionService],
  entryComponents: []
})
export class InscriptionsModule { }
