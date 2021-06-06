import {Component, OnDestroy} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatDialog} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { UserState } from '../state/user/user.reducers';
import { getUser } from '../state/user/user.selectors';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('moveUp', [
      state('out',style({opacity: 0})),
      state('in', style({opacity: 1})),
      transition('*=>in', [
            style({opacity: 0}),
            animate(600 )]),
      transition('*=>out',
          animate(600, style({opacity: 0})))

        ]
    )
  ]
})
export class ToolbarComponent {

  // just for testing
  clicked: string = 'out';

  user$: Observable<string> = this.store$.pipe(select(getUser), map(user => user?.username ? user.username : 'Login'));

  constructor(public dialog: MatDialog,  private store$: Store<UserState>) {
  };


  showLoginDialog() {
    this.dialog.open(LoginComponent,{ autoFocus: false });
  }


  //====just for animation testing
  setClickedIn() {
    this.clicked = this.clicked === 'in' ? 'out' : 'in';
    console.log(this.clicked)
  }
}
