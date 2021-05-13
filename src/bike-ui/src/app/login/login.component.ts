import {  ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable, Subscription} from 'rxjs';
import { UserState} from '../state/user/user.reducers';
import { select, Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import {delay, delayWhen, filter, skip, tap} from 'rxjs/operators';
import {State} from "./login-state";
import {
  LoginScreen,
  move,
  moveResetDigits,
  moveText,
  mustMatch,
  registered,
  showPassword,
  slide, hide,
  User, delayOnNull,
} from './login.model';

import {getLoading,
  getMessage,
  getScreen,
  getUser} from '../state/user/user.selectors';

import {
  login, logout,
  register, setMessage,
  switchScreen
} from '../state/user/user.actions';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [
        slide,
        move,
        moveText,
        moveResetDigits,
        registered,
        showPassword,
        hide
    ]
})
export class LoginComponent implements OnInit,OnDestroy {

  STATE: State;
  user :User;

  openingClosing = val => this.dialogRef.disableClose = val;


  loading$: Observable<boolean> = this.store.pipe(select(getLoading),tap(this.openingClosing));
  screen$: Observable<LoginScreen> = this.store.pipe(select(getScreen));
  message$: Observable<string> = this.store.pipe(select(getMessage));
  loggedIn$: Observable<User> = this.store.pipe(select(getUser), skip(1), filter(user => Boolean(user)));
  user$: Observable<User> = this.store.pipe(select(getUser),tap(c=> console.log("user",c)));


  ANIMATION_PARAMETER: number = 120;
  PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&+,:;=?#$§"%&/()`!*'@])\S{6,12}$/;
  MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  subscriptions: Subscription = new Subscription();


  get message() {
    return this._responseMessage ? this._responseMessage : this._defaultMessage;
  }

  _defaultMessage: string = 'not a valid email address';
  _responseMessage: string;

    constructor(private fb: FormBuilder,
                private chDet: ChangeDetectorRef,
                private store: Store<UserState>,
                private dialogRef: MatDialogRef<LoginComponent>,
    ) {

        const login = fb.group(
          {
              email:            ["arkadi.daschkewitsch@gmail.com", [Validators.required, Validators.pattern(this.MAIL_PATTERN)]],
              password:         ["Test123!", [Validators.required,  Validators.pattern(this.PASSWORD_PATTERN)]],
              confirmPassword:  [null, {validators: [Validators.pattern(this.PASSWORD_PATTERN)]}], //
              forgotPassword:   []
          },
          {
             validator: mustMatch('password', 'confirmPassword')  // Adding cross-validation
          });


        const reset = fb.group(
            {
                resetEmail:             [null, [Validators.pattern(this.MAIL_PATTERN)]],
                resetCode:               null,
                resetPassword:          [null, [Validators.pattern(this.PASSWORD_PATTERN)]],
                confirmResetPassword:   [null, [Validators.pattern(this.PASSWORD_PATTERN)]]
            },
            {
                validator: mustMatch('resetPassword', 'confirmResetPassword') // Adding cross-validation
            });

        this.STATE = new State( login, reset, this.dialogRef);

  }



  ngOnInit(): void {
    this.subscriptions
      .add(this.screen$.subscribe( screen                           => this.STATE.switchScreen(screen)))
      .add(this.loading$.subscribe(ldg                              => this.STATE.loading(ldg)))
      .add(this.message$.subscribe(message                          => this.setResetMessage(message)))
      .add(this.user$.pipe(delayWhen(delayOnNull)).subscribe(user   => this.user = user))
      .add(this.loggedIn$.pipe(delay(2000)).subscribe(()    => this.dialogRef.close()))
      .add(this.STATE.loginControls.email.valueChanges.subscribe(() => this.store.dispatch(setMessage(null))))

    this.STATE.resetControls.resetCode.disable();
    this.STATE.resetControls.resetPassword.disable();
    this.STATE.resetControls.confirmResetPassword.disable();
  }



  onLoginSubmit() {
    this.STATE.loginForm.markAllAsTouched();

    const email             = this.STATE.loginControls.email.value,
          password          = this.STATE.loginControls.password.value,
          confirmedPassword = this.STATE.loginControls.confirmPassword.value;

    switch (this.STATE.activePane) {
        case "login"        : this.store.dispatch(login({email, password})); break;
        case "register"     : this.store.dispatch(register({email, password, confirmedPassword})); break;
        case "registered"   : this.store.dispatch(switchScreen({screen: 'login'})); break;
    }
    }




  loginRegisterScreen(screen?: LoginScreen) {

        if (screen) {
           this.store.dispatch(switchScreen({ screen }))
        } else {
            switch (this.STATE.activePane) {
                case 'reset':
                case 'password':
                case 'register':
                case 'code':
                case 'done':
                case 'registered' : this.store.dispatch(switchScreen({ screen: 'login' })); break;
                case 'login': this.store.dispatch(switchScreen({screen:'register'})); break;
            }
        }
    }


    resetPasswordScreen(validCode?: FormGroup) {

        switch (this.STATE.activePane) {
            case 'reset':      this.store.dispatch(switchScreen({screen:'code'})); break;
            case 'password':   this.store.dispatch(switchScreen({screen:'done'})); break;
            case 'code':       if(validCode?.valid) this.store.dispatch(switchScreen({screen:'password'}));break;
            case 'done':
                this.store.dispatch(switchScreen({screen:'login'}));
                this.STATE.resetForm.reset();
        }

        // do some service stuff here, resend email again if missing ...
    }


    onInput(){
     if(this.STATE.loginForm.invalid) {
        this.STATE.loginControls.email.updateValueAndValidity()
        this.STATE.loginControls.password.updateValueAndValidity()
      }
    }


    ngOnDestroy(): void {
      this.subscriptions.unsubscribe()
     if (this.STATE.activePane === 'logged-in') this.store.dispatch(switchScreen({screen: 'logout'}));
    };


  private setResetMessage(message: string) {
    this._responseMessage = Boolean(message) ? message : null;

    if (message) {
      this.STATE.loginControls.email.setErrors({"invalid": this._responseMessage });
      this.STATE.loginControls.password.setErrors({"invalid": this._responseMessage });
    }
  }

  logOut() {
    this.store.dispatch(logout());
  }
}


