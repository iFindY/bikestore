import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {FormBuilder } from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {mustMatch, UserScreen} from "../user.model";
import {Observable, Subscription} from "rxjs";
import {getLoading, getMessage} from "../../state/user/user.selectors";
import {
  clearMessage,
  login,
  register,
  setMessage,
  switchScreen
} from "../../state/user/user.actions";
import {StateService} from "../user-state-service";
import {UserState} from "../../state/user/user.reducers";
import {move, moveText, registered,loginRegister} from "./login.animations";
import {AppValidators} from "../../common/validation/validator";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default,
  animations: [move, moveText, registered, loginRegister]
})
export class LoginComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();

  _responseMessage: string;

  message$: Observable<string> = this.store.pipe(select(getMessage));
  loading$: Observable<{ login: boolean, reset: boolean }> = this.store.pipe(select(getLoading));


  constructor(private fb: FormBuilder,
              private changeDetectorRef: ChangeDetectorRef,
              private store: Store<UserState>,
              public state: StateService) {

    state.loginForm = fb.group(
        {
          email: ["arkadi.daschkewitsch@gmail.com", [AppValidators.email]],
          password: ["Test123!", [AppValidators.required]],
          confirmPassword: [null, [AppValidators.validatePassword]]
        },
        {
           validator: mustMatch('password', 'confirmPassword')  // Adding cross-validation
        });


  }


  get passwordErrors() {

    return this.state.activePaneSubject.value == 'login' ?
        this.state.loginPassword.errors?.required :
        this.state.loginPassword.errors?.validatePassword;
  }


  get confirmPasswordErrors() {

    if (this.state.loginConfirmPassword.errors?.validatePassword) {
      return this.state.loginConfirmPassword.errors.validatePassword;
    } else if (this.state.loginConfirmPassword?.errors?.mustMatch) {
      return this.state.loginConfirmPassword?.errors.mustMatch;
    }
  }

  get emailError() {
    return this._responseMessage ? this._responseMessage : this.state.loginEmail?.errors?.email;
  }


  loginRegisterScreen(screen?: UserScreen) {

    if (screen) { // we set the screen or else  default to login register
      this.store.dispatch(switchScreen({screen}))
    } else {
      switch (this.state.activePaneSubject.value) {
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


  onFocus() {
    if (this.state.loginForm.invalid) {
      this.store.dispatch(clearMessage())
      this.state.loginControls.email.updateValueAndValidity()
      this.state.loginControls.password.updateValueAndValidity()
    }
  }

  private setResetMessage(message: string) {
    this._responseMessage = message;

    if (message) {
      this.state.loginControls.email.setErrors({"async": this._responseMessage});
      this.state.loginControls.password.setErrors({"async": this._responseMessage});
    }
  }


  onLoginSubmit() {
    this.state.loginForm.markAllAsTouched();

    const email = this.state.loginControls.email.value,
        password = this.state.loginControls.password.value,
        confirmedPassword = this.state.loginControls.confirmPassword.value;

    switch (this.state.activePaneSubject.value) {
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
    this.subscriptions.add(this.state.loginPassword.statusChanges
    .pipe(filter(val => val == 'VALID'))
    .subscribe(status => this.state.loginForm.updateValueAndValidity()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }



  get resetButtonVisible ():boolean{
    return ['login', 'register'].includes(this.state.activePaneSubject.value);
  }

}
