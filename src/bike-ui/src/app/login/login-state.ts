import {LoginScreen, LoginWindow} from "./login.model";
import {AbstractControl, FormGroup} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {LoginComponent} from "./login.component";

type Button = 'Sign In' | 'Sign Up'| 'Return';


export class State {

  public login     = {index: -1}
  public register  = {index: -1}
  public registered = {index: -1}

  public reset     = {index: -1}
  public code      = {index: -1}
  public password  = {index: -1}
  public done      = {index: -1}

  public logout    = {index: -1}

  public activeWindow : LoginWindow = 'login';
  public activePane: LoginScreen = 'login';

  public loginForm: FormGroup;
  public resetForm: FormGroup;
  private  enabledControls: AbstractControl[] = [];

  get loginControls() { return this.loginForm.controls; }
  get resetControls() { return this.resetForm.controls; }
  get resetPassword() {return this.resetControls.resetPassword.value}
  get confirmedResetPassword() {return this.resetControls.confirmResetPassword.value}
  get resetCode() {return Object.values(this.resetControls.resetCode.value).join('')}
  get resetEmail() {return this.resetControls.resetEmail.value}

  public secondButton:   Button = 'Sign Up'
  public mainButton:     Button = 'Sign In';
  public resetButton:    string = 'Send Email';
  public help: string = 'Dont have an account?';

  private dialogRef: MatDialogRef<LoginComponent>;

  constructor(loginForm: FormGroup,
              resetForm:FormGroup,
              dialogRef: MatDialogRef<LoginComponent>) {
    this.loginForm = loginForm;
    this.resetForm = resetForm;
    this.dialogRef = dialogRef;
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
    this.logout.index   = -1;
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


  public switchScreen(screen: LoginScreen) {
    switch (screen) {
      case 'login': {
        this.onLogin();
        this.activeWindow="login"
        this.activePane='login';
        this.mainButton = 'Sign In'
        this.secondButton = 'Sign Up';
        this.help = 'Dont have an account?';

        this.resetForm.reset();
        this.resetForm.markAsUntouched();
        this.resetForm.disable();

        this.loginControls.email.enable();
        this.loginControls.password.enable();
        this.loginControls.confirmPassword.disable();

        this.loginControls.email.setErrors(null);
        this.loginControls.password.setErrors(null);
        this.loginControls.confirmPassword.setErrors(null);

        break;
      }
      case 'logged-in': {
        this.onLongedIn();
        this.activePane='logged-in';

        this.resetForm.reset();
        this.resetForm.disable();
        this.loginForm.reset();
        this.loginForm.disable();

        break;
      }
      case 'register': {
        this.onRegister();
        this.activePane='register';

        this.mainButton = 'Sign Up'
        this.secondButton = 'Sign In';
        this.help = 'Already registered?';

        this.loginControls.confirmPassword.enable();
        this.loginControls.confirmPassword.setErrors(null);
        break;
      }
      case 'registered': {
        this.onDone();
        this.activePane = 'registered';
        this.mainButton = 'Return'

        this.loginControls.password.disable();
        this.loginControls.confirmPassword.disable();
        break;
      }
      case 'reset': {
        this.onReset();
        this.loginForm.reset();
        this.loginForm.markAsUntouched();
        this.loginForm.disable();

        this.activePane = 'reset';
        this.resetButton = 'Send Email';

        this.resetControls.resetEmail.enable();

        this.resetControls.resetCode.disable();
        this.resetControls.resetPassword.disable();
        this.resetControls.confirmResetPassword.disable();
        break;
      }
      case 'code': {
        this.onCode();
        this.activePane = 'code';
        this.resetControls.resetCode.enable();


        this.resetControls.resetPassword.disable();
        this.resetControls.confirmResetPassword.disable();
        break;
      }
      case 'password': {
        this.onPassword();
        this.activePane = 'password';
        this.resetButton = 'Change Password';

        this.resetControls.resetPassword.enable();
        this.resetControls.confirmResetPassword.enable();

        this.resetControls.resetPassword.setErrors(null);
        this.resetControls.confirmResetPassword.setErrors(null);

        this.resetControls.resetEmail.disable();
        this.resetControls.resetCode.disable();
        break;
      }
      case 'done': {
        this.onDone();
        this.activePane = 'done';
        this.resetButton = 'Return';

        this.resetControls.resetPassword.disable();
        this.resetControls.confirmResetPassword.disable();
        break;
      }
      case 'logout':
      default: {
        this.onLogout();
        this.activePane = 'logout';
        this.resetButton = 'Return';

        this.loginControls.email.disable();
        this.loginControls.password.disable();
      }
    }

    this.loginForm.markAsPristine();
    this.resetForm.markAsPristine();
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


}

