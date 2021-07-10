import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {UserState} from '../state/user/user.reducers';
import {select, Store} from '@ngrx/store';
import {MatDialogRef} from '@angular/material/dialog';
import {delay, filter, skip, tap} from 'rxjs/operators';
import {StateService} from "./user-state-service";
import {LoginScreen, User,} from './user.model';
import {getLoading, getScreen, getUser} from '../state/user/user.selectors';
import {login, logout, switchScreen,} from '../state/user/user.actions';
import {slide} from "./user-animations";


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [slide]
})
export class UserComponent implements OnInit, OnDestroy {


  private openingClosing = ({login, reset}) => this.dialogRef.disableClose = login || reset;

  private loading$: Observable<{ login: boolean, reset: boolean }> = this.store.pipe(select(getLoading), tap(this.openingClosing));
  private screen$: Observable<LoginScreen> = this.store.pipe(select(getScreen));
  private loggedIn$: Observable<User> = this.store.pipe(select(getUser), skip(1), filter(user => Boolean(user)));

  subscriptions: Subscription = new Subscription();


  constructor(private fb: FormBuilder,
              private chDet: ChangeDetectorRef,
              private store: Store<UserState>,
              private dialogRef: MatDialogRef<UserComponent>,
              public state: StateService) {}


  ngOnInit(): void {
    this.subscriptions
    .add(this.screen$.subscribe(screen => this.state.switchScreen(screen)))
    .add(this.loading$.subscribe(ldg => this.state.loading(ldg)))
    .add(this.loggedIn$.pipe(delay(2000)).subscribe(() => this.dialogRef.close()));

    this.state.resetControls.resetCode.disable();
    this.state.resetControls.resetPassword.disable();
    this.state.resetControls.confirmResetPassword.disable();
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()

    switch (this.state.activePane) {
      case "logout"   :
        break;
      case "logged-in":
        this.store.dispatch(switchScreen({screen: 'logout'}));
        break;
      default         :
        this.store.dispatch(switchScreen({screen: 'login'}))
    }
  }
}


