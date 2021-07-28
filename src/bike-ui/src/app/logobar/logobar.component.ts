import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {select, Store} from "@ngrx/store";
import {getUser} from "../state/user/user.selectors";
import {map} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {UserState} from "../state/user/user.reducers";
import {UserComponent} from "../user/user.component";

@Component({
  selector: 'app-logobar',
  templateUrl: './logobar.component.html',
  styleUrls: ['./logobar.component.scss']
})
export class LogobarComponent {

  user$: Observable<string> = this.store$.pipe(select(getUser), map(user => user?.username ? user.username : 'Login'));

  constructor(public dialog: MatDialog,  private store$: Store<UserState>) {
  };


  showLoginDialog() {
    this.dialog.open(UserComponent,{ autoFocus: false, panelClass: 'user-modal-dialog' });
  }
}
