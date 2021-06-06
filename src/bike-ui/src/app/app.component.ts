import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {UserState} from "./state/user/user.reducers";
import {userStatus} from "./state/user/user.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Arkadi\'s canto';


  constructor(private store$: Store<UserState>) {
    this.store$.dispatch(userStatus())
  };
}
