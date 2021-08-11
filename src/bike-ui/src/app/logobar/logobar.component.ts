import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {getUser} from "../state/user/user.selectors";
import {map} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {UserState} from "../state/user/user.reducers";
import {UserComponent} from "../user/user.component";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'app-logobar',
  templateUrl: './logobar.component.html',
  styleUrls: ['./logobar.component.scss']
})
export class LogobarComponent implements OnInit,OnDestroy{
  sideNav:boolean = false;
  user$: Observable<string> = this.store$.pipe(select(getUser), map(user => user?.username ? user.username : 'Login'));
  widthObserver: Observable<BreakpointState> = this.breakpointObserver.observe(['(min-width: 1414px)',  Breakpoints.XSmall]);
  subscriptions: Subscription;

  @Output() sideMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  lessons: string[] = ['Guitar', 'Trumpet', 'Violin', 'Singing', 'Piano', 'Drum'];
  mouseover: boolean;

  constructor(public dialog: MatDialog,
              private store$: Store<UserState>,
              public breakpointObserver: BreakpointObserver) {
  };

  ngOnInit(): void {
    this.subscriptions = this.widthObserver.subscribe((state: BreakpointState) =>
      this.sideNav = state.breakpoints[Breakpoints.XSmall]);
  }


  showLoginDialog() {
    this.dialog.open(UserComponent,{ autoFocus: false, panelClass: 'user-modal-dialog' });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  mouseOver(b: boolean) {
    this.mouseover= b;
  }

}
