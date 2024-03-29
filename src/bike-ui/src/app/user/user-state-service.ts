import {Button, UserScreen, LoginWindow} from "./user.model";
import {AbstractControl, FormGroup} from "@angular/forms";
import {BehaviorSubject, Subscription} from "rxjs";
import {Injectable, OnDestroy} from "@angular/core";
import {AppValidators} from "../common/validation/validator";



@Injectable()
export class StateService implements OnDestroy{

  public login      = {index: -1}
  public register   = {index: -1}
  public registered = {index: -1}

  public reset     = {index: -1}
  public code      = {index: -1}
  public password  = {index: -1}
  public done      = {index: -1}

  public logout    = {index: -1}


  public activeWindowSubject: BehaviorSubject<LoginWindow> = new BehaviorSubject<LoginWindow>('login');
  public activePaneSubject: BehaviorSubject<UserScreen> = new BehaviorSubject<UserScreen>('login');

  public loginForm: FormGroup;
  public _resetForm: FormGroup;
  private  enabledControls: AbstractControl[] = [];



  set resetForm(resetForm: FormGroup) {
    this._resetForm = resetForm;
    this.subscription.add(this.resetCodeControl.statusChanges.subscribe(s => this.onCodeInput(s)))
  }
  get loginControls() { return this.loginForm.controls; }
  get loginPassword() { return this.loginForm.controls.password; }
  get loginConfirmPassword() { return this.loginForm.controls.confirmPassword; }
  get loginEmail() { return this.loginForm.controls.email; }

  get resetControls() { return this.resetForm.controls; }
  get resetCodeControl() { return this.resetForm.controls.resetCode; }
  get resetPassword() {return this.resetControls.resetPassword}
  get resetCode() {return Object.values(this.resetControls.resetCode.value).join('')}
  get resetEmail() {return this.resetControls.resetEmail.value}
  get confirmedResetPassword() {return this.resetControls.confirmResetPassword}
  get resetForm(): FormGroup {
    return this._resetForm
  }

  public  resetBtn: string [] = ['Send Email', 'Resend Email', 'Confirm Code', 'Change Password', 'Return'];
  public  loginBtn: Button [] = ['Sign In','Sign Up', 'Return'];

  public mainButton:     Button = this.loginBtn[0];
  public secondButton:   Button = this.loginBtn[1];
  public resetButton:    string = this.resetBtn[0];
  public help: string = 'Dont have an account?';
  private subscription: Subscription = new Subscription();

  constructor() {

  }
  onLogin() {
    this.login.index    =  0;
    this.logout.index   = -1;
    this.register.index = -1;
    this.reset.index    = -1;
    this.code.index     = -1;
    this.password.index = -1;
  };
  onLongedIn() {
    this.login.index    = -1;
    this.logout.index   = -1;
    this.register.index = -1;
    this.reset.index    = -1;
    this.code.index     = -1;
    this.password.index = -1;
  };
  onLogout() {
    this.login.index    = -1;
    this.logout.index   =  1;
    this.register.index = -1;
    this.reset.index    = -1;
    this.code.index     = -1;
    this.password.index = -1;
  };
  onRegister() {
    this.login.index    =  0;
    this.logout.index   = -1;
    this.register.index =  0;
    this.reset.index    = -1;
    this.code.index     = -1;
    this.password.index = -1;
  };
  onReset() {
    this.login.index    = -1;
    this.logout.index   = -1;
    this.register.index = -1;
    this.reset.index    =  0;
    this.code.index     = -1;
    this.password.index = -1;
  };
  onCode() {
    this.login.index    = -1;
    this.logout.index   = -1;
    this.register.index = -1;
    this.reset.index    =  0;
    this.code.index     =  0;
    this.password.index = -1;
  };
  onPassword() {
    this.login.index    = -1;
    this.logout.index   = -1;
    this.register.index = -1;
    this.reset.index    = -1;
    this.code.index     = -1;
    this.password.index =  0;
  };
  onDone() {
    this.login.index    = -1;
    this.logout.index   = -1;
    this.register.index = -1;
    this.reset.index    = -1;
    this.code.index     = -1;
    this.password.index = -1;
  };


  onCodeInput(valid: string) {
    if (this.activePaneSubject.value == 'code') {

      valid == 'INVALID'?
          this.resetButton = 'Resend Email':
          this.resetButton = 'Confirm Code';

    } else if (this.activePaneSubject.value == 'password') {
      this.resetButton = 'Change Password';

    }
  }

  public switchScreen(screen: UserScreen) {
    switch (screen) {
      case 'login': {
        this.onLogin();
        this.activeWindowSubject.next('login')
        this.activePaneSubject.next('login');
        this.mainButton = this.loginBtn[0];
        this.secondButton = 'Sign Up';
        this.help = 'Dont have an account?';

        this.resetForm.reset();
        this.resetForm.markAsUntouched();
        this.resetForm.disable();

        this.loginControls.email.enable();
        this.loginControls.password.enable();
        this.loginControls.password.clearValidators();
        this.loginControls.password.setValidators([AppValidators.required])
        this.loginControls.confirmPassword.disable();
        this.loginForm.updateValueAndValidity();
        this.resetForm.markAsPristine();
        this.resetForm.markAsUntouched();

        break;
      }
      case 'logged-in': {
        this.onLongedIn();
        this.activePaneSubject.next('logged-in');

        this.resetForm.reset();
        this.resetForm.disable();
        this.loginForm.reset();
        this.loginForm.disable();

        break;
      }
      case 'register': {
        this.onRegister();
        this.activePaneSubject.next('register');

        this.mainButton = 'Sign Up'
        this.secondButton = 'Sign In';
        this.help = 'Already registered?';

        this.loginControls.password.clearValidators();
        this.loginControls.password.setValidators(AppValidators.validatePassword);
        this.loginControls.password.updateValueAndValidity();
        this.loginControls.confirmPassword.enable();
        this.loginForm.markAsUntouched();
        break;
      }
      case 'registered': {
        this.onDone();
        this.activePaneSubject.next('registered');
        this.mainButton = 'Return'

        this.loginControls.password.disable();
        this.loginControls.confirmPassword.disable();
        break;
      }
      case 'reset': {
        this.activeWindowSubject.next('reset')
        this.onReset();
        this.loginForm.reset();
        this.loginForm.markAsUntouched();
        this.loginForm.disable();

        this.activePaneSubject.next('reset');
        this.resetButton = this.resetBtn[0];

        this.resetControls.resetEmail.enable();

        this.resetControls.resetCode.disable();
        this.resetControls.resetPassword.disable();
        this.resetControls.confirmResetPassword.disable();

        this.loginForm.markAsPristine();
        this.loginForm.markAsUntouched();

        break;
      }
      case 'code': {
        this.onCode();
        this.activePaneSubject.next('code');
        this.resetControls.resetCode.enable();
        this.resetButton = this.resetBtn[1];

        this.resetControls.resetPassword.disable();
        this.resetControls.confirmResetPassword.disable();
        break;
      }
      case 'password': {
        this.onPassword();
        this.activePaneSubject.next('password');
        this.resetButton =  this.resetBtn[3];

        this.resetForm.markAsUntouched();

        this.resetControls.resetPassword.enable();
        this.resetControls.confirmResetPassword.enable();

        this.resetControls.resetEmail.disable();
        this.resetControls.resetCode.disable();
        break;
      }
      case 'done': {
        this.onDone();
        this.activePaneSubject.next('done');
        this.resetButton = this.resetBtn[4];

        this.resetControls.resetPassword.disable();
        this.resetControls.confirmResetPassword.disable();
        break;
      }
      case 'logout':
      default: {
        this.activeWindowSubject.next('logout');
        this.onLogout();
        this.activePaneSubject.next('logout');
        this.resetButton = 'Return';

        this.loginControls.email.disable();
        this.loginControls.password.disable();
      }
    }

  }

  public loading({login, reset}) {

    if (login || reset) {

      { // cache enabled controls
        const loginControls = Object
        .values(this.loginForm.controls)
        .filter(x => x.enabled);

        const resetControls = Object
        .values(this.resetForm.controls)
        .filter(x => x.enabled);

        this.enabledControls.push(...loginControls, ...resetControls)
      }

      { // disable all
        this.loginForm.disable();
        this.resetForm.disable();
      }

    } else { // enable controls and clear cache

      this.enabledControls.forEach(cl => cl.enable());
      this.enabledControls = [];
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

