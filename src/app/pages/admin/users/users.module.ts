import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { UserService } from './user.service';
import { MaterialModule } from '../../../shared/material.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { NotificationService } from '../../../services/notification.service';
import { UsersComponent } from './users.component';
import { UserListResolverGuard } from './user-list/user-list-resolver.guard';
import { PipesModule } from '../../../pipes/pipes.module';
import { RolesModule } from '../roles/roles.module';
import { CoursesModule } from '../courses/courses.module';

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserDetailComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    PipesModule,
    RouterModule,
    RolesModule,
    CoursesModule
  ],
  exports: [],
  providers: [UserService, NotificationService, UserListResolverGuard]
})
export class UsersModule {}
