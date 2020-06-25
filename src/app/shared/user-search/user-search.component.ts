import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ComboSearchComponent } from '../combo-search/combo-search.component';

import { User } from '../../pages/admin/users/user.model';
import _ from 'lodash';
import { UserService } from '../../pages/admin/users/user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent
  extends ComboSearchComponent<User> implements OnChanges {
  selected: string;
  @Input() roles: number[] = [];
  @Input() placeholder = 'Selecciona';
  @Output() userChanged = new EventEmitter<User[]>();
  constructor(public _userService: UserService) {
    super(_userService, false);
  }
  onLoad(filter = '') {
    debugger
    if (!this.roles) {
      return;
    }
    return this.service
      .getAll<User>(filter, 'id', 'asc', 0, 0, this.roles)
      .subscribe((response: any) => {
        this.payload = response.payload;
        this.filteredData.next(this.payload.slice());
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.roles) {
      this.onLoad();
    }
  }
  onSelectionChange(evt) {
    const selected = _.filter(this.payload, (el) => {
      return el.id === evt.value[0];
    });
    this.userChanged.emit(selected[0]);
  }
}
