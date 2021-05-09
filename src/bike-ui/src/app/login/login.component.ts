import {  ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {  Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { UserState} from '../state/user/user.reducers';
import { select, Store } from '@ngrx/store';
import {
    LoginScreen, move,
    moveResetDigits,
    moveText, mustMatch,
    registered,
    showPassword, slide,
    User,
} from './login.model';
import {getLoading, getMessage, getScreen, getUser} from '../state/user/user.selectors';
import {
  hideScreen,
  login,
  register, setMessage,
  switchScreen
} from '../state/user/user.actions';
import { MatDialogRef } from '@angular/material/dialog';
import {delay, filter, skip} from 'rxjs/operators';
import {State} from "./login-state";



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
        showPassword
    ]
})
export class LoginComponent implements OnInit,OnDestroy {

  state: State;

  loading$: Observable<boolean> = this.store.pipe(select(getLoading));
  screen$: Observable<LoginScreen> = this.store.pipe(select(getScreen));
  message$: Observable<string> = this.store.pipe(select(getMessage));
  loggedIn$: Observable<User> = this.store.pipe(select(getUser), skip(1), filter(user => Boolean(user)));


  ANIMATION_PARAMETER: number = 120;
  PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&+,:;=?#$!*'@])\S{6,12}$/;
  MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  subscriptions: Subscription = new Subscription();


  get message() {
    return this._responseMessage ? this._responseMessage : this._defaultMessage;
  }

  _defaultMessage: string = 'not a valid email address';
  _responseMessage: string;

    // TODO on input reset all input fields , or on focus drop error state
    constructor(private fb: FormBuilder,
                private authService: AuthenticationService,
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

        this.state = new State( login, reset, this.dialogRef);

  }



  ngOnInit(): void {


      this.subscriptions
      .add(this.screen$.subscribe( screen  => this.state.switchScreen(screen)))
      .add(this.loading$.subscribe(ldg     => this.state.loading(ldg)))
      .add(this.message$.subscribe(message => this.setResetMessage(message)))
      .add(this.loggedIn$.pipe(delay(2000)).subscribe(    () => this.dialogRef.close()))
      .add(this.state.loginControls.email.valueChanges.subscribe( () => this.store.dispatch(setMessage(null))))


      this.state.resetControls.resetCode.disable();
      this.state.resetControls.resetPassword.disable();
      this.state.resetControls.confirmResetPassword.disable();
  }




  onLoginSubmit() {
    this.state.loginForm.markAllAsTouched();

    const email             = this.state.loginControls.email.value,
          password          = this.state.loginControls.password.value,
          confirmedPassword = this.state.loginControls.confirmPassword.value;

    switch (this.state.activePane) {
        case "login"        : this.store.dispatch(login({email, password})); break;
        case "register"     : this.store.dispatch(register({email, password, confirmedPassword})); break;
        case "registered"   : this.store.dispatch(switchScreen({screen: 'login'})); break;
    }
  }




  firstScreenState(screen?: LoginScreen) {

        if (screen) {
           this.store.dispatch(switchScreen({ screen }))
        } else {
            switch (this.state.activePane) {
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


    secondScreenState(validCode?: FormGroup) {

        switch (this.state.activePane) {
            case 'reset':      this.store.dispatch(switchScreen({screen:'code'})); break;
            case 'password':   this.store.dispatch(switchScreen({screen:'done'})); break;
            case 'code':       if(validCode?.valid) this.store.dispatch(switchScreen({screen:'password'}));break;
            case 'done':
                this.store.dispatch(switchScreen({screen:'login'}));
                this.state.resetForm.reset();
        }

        // do some service stuff here, resend email again if missing ...
    }





    resetF($event: Event) {
        if(this.state.loginForm.invalid){
            this.state.loginControls.email.updateValueAndValidity();
            this.state.loginControls.password.updateValueAndValidity();
            this.state.loginForm.updateValueAndValidity();
        }

    }

    ngOnDestroy(): void {
        this.store.dispatch(hideScreen())
        this.subscriptions.unsubscribe()
    };


    private setResetMessage(message:string){
      this._responseMessage = Boolean(message) ? message : null;

      this.state.loginControls.email.setErrors({"invalid": true});
      this.state.loginControls.password.setErrors({"invalid": true});
    }
}


