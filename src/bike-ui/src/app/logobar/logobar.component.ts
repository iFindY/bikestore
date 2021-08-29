import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {select, Store} from "@ngrx/store";
import {getUser} from "../state/user/user.selectors";
import {map} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {UserState} from "../state/user/user.reducers";
import {UserComponent} from "../user/user.component";
import {LayoutService} from "../services/layout.service";

@Component({
  selector: 'app-logobar',
  templateUrl: './logobar.component.html',
  styleUrls: ['./logobar.component.scss']
})
export class LogobarComponent implements OnDestroy {
  sideNav = false;
  mouseover: boolean;
  subscriptions: Subscription;

  @Output() sideMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  user$: Observable<string> = this.store$.pipe(select(getUser), map(user => user?.username ? user.username : 'Login'));


  constructor(public dialog: MatDialog,
              private store$: Store<UserState>,
              private screenSizeService: LayoutService) {
    this.subscriptions = this.screenSizeService.isPhoneSize()
    .subscribe(phone => this.sideNav = phone);
  };


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
