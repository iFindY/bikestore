import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {UserState} from "./state/user/user.reducers";
import {userStatus} from "./state/user/user.actions";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Observable, Subscription} from "rxjs";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent{
  title = 'Arkadi\'s canto';

  events: string[] = ['Team', 'Events', 'Blog'];
  contacts: string[] = ['Pricing', 'Contact'];
  lessons: string[] = ['Guitar', 'Trumpet', 'Violin', 'Singing', 'Piano', 'Drum'];

  constructor(private store$: Store<UserState>, public breakpointObserver: BreakpointObserver) {
    this.store$.dispatch(userStatus())

  };

}
