import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {mustMatch, UserScreen} from "../user.model";
import {Observable, Subscription} from "rxjs";
import {getLoading, getMessage} from "../../state/user/user.selectors";
import {login, register, switchScreen} from "../../state/user/user.actions";
import {StateService} from "../user-state-service";
import {UserState} from "../../state/user/user.reducers";
import {move, moveText, registered,loginRegister} from "./login.animations";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [move, moveText, registered, loginRegister]
})
export class LoginComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();

  PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&+,:;=?#$§"%&/()`!*'@])\S{6,12}$/;
  MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;


  _defaultMessage: string = 'not a valid email address';
  _responseMessage: string;

  message$: Observable<string> = this.store.pipe(select(getMessage));
  loading$: Observable<{ login: boolean, reset: boolean }> = this.store.pipe(select(getLoading));


  constructor(private fb: FormBuilder,
              private chDet: ChangeDetectorRef,
              private store: Store<UserState>,
              public state: StateService) {

    state.loginForm = fb.group(
        {
          email: ["arkadi.daschkewitsch@gmail.com", [Validators.required, Validators.pattern(this.MAIL_PATTERN)]],
          password: ["Test123!", [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]],
          confirmPassword: [null, {validators: [Validators.pattern(this.PASSWORD_PATTERN)]}], //
          forgotPassword: []
        },
        {
          validator: mustMatch('password', 'confirmPassword')  // Adding cross-validation
        });

  }


  loginRegisterScreen(screen?: UserScreen) {

    if (screen) { // we set the screen or else  default to login register
      this.store.dispatch(switchScreen({screen}))
    } else {
      switch (this.state.activePane) {
        case 'reset':
        case 'password':
        case 'register':
        case 'code':
        case 'done':
        case 'registered' :
          this.store.dispatch(switchScreen({screen: 'login'}));
          break;
        case 'login':
          this.store.dispatch(switchScreen({screen: 'register'}));
          break;
      }
    }
  }


  onInput() {
    if (this.state.loginForm.invalid) {
      this.state.loginControls.email.updateValueAndValidity()
      this.state.loginControls.password.updateValueAndValidity()
    }
  }

  private setResetMessage(message: string) {
    this._responseMessage = Boolean(message) ? message : null;

    if (message) {
      this.state.loginControls.email.setErrors({"invalid": this._responseMessage});
      this.state.loginControls.password.setErrors({"invalid": this._responseMessage});
    }
  }


  onLoginSubmit() {
    this.state.loginForm.markAllAsTouched();

    const email = this.state.loginControls.email.value,
        password = this.state.loginControls.password.value,
        confirmedPassword = this.state.loginControls.confirmPassword.value;

    switch (this.state.activePane) {
      case "login"        :
        this.store.dispatch(login({email, password}));
        break;
      case "register"     :
        this.store.dispatch(register({email, password: password, confirmedPassword}));
        break;
      case "registered"   :
        this.store.dispatch(switchScreen({screen: 'login'}));
        break;
    }
  }


  ngOnInit(): void {
    this.subscriptions.add(this.message$.subscribe(message => this.setResetMessage(message)));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get message() {
    return this._responseMessage ? this._responseMessage : this._defaultMessage;
  }

  get resetButtonVisible ():boolean{
    return ['login','register'].includes(this.state.activePane);
  }






}
