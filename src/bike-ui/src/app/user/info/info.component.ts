import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {UserState} from "../../state/user/user.reducers";
import {StateService} from "../user-state-service";
import { User} from "../user.model";
import {delayWhen} from "rxjs/operators";
import {interval, Observable, of, Subscription} from "rxjs";
import {getUser} from "../../state/user/user.selectors";
import {logout} from "../../state/user/user.actions";
import {hide} from "./info.animations";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  animations: [hide]
})
export class InfoComponent implements OnInit, OnDestroy {

  user: User;
  user$: Observable<User> = this.store.pipe(select(getUser));

  private delayOnNull = val => (val == null) ? interval(1000) : of(val);


  subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder,
              private chDet: ChangeDetectorRef,
              private store: Store<UserState>,
              public state: StateService) {


  }

  ngOnInit(): void {

    this.subscriptions.add(this.user$.pipe(delayWhen(this.delayOnNull)).subscribe(user => this.user = user))
  }


  logOut() {
    this.store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }



}
