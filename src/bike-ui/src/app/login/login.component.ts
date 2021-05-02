import {  ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { animate, keyframes, state, style, transition, trigger, query, animateChild, group } from '@angular/animations';
import {  Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { UserState } from '../state/user/user.reducers';
import { select, Store } from '@ngrx/store';
import { LoginScreen, User } from './login.model';
import {getLoading, getMessage, getScreen, getUser} from '../state/user/user.selectors';
import { hideScreen, login, register, switchScreen } from '../state/user/user.actions';
import { MatDialogRef } from '@angular/material/dialog';
import {delay, filter, skip, tap} from 'rxjs/operators';

type Button = 'Sign In' | 'Sign Up'| 'Return';

/*
    every trigger should know their state.
    if it is a nested trigger, doest meter have to redefine them
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [

        trigger('slide', [
            state('login',      style({ transform: 'translateX(0)' })),
            state('register',   style({ transform: 'translateX(0)' })),
            state('registered',  style({ transform: 'translateX(0)' })),
            state('reset',      style({ transform: 'translateX(-33%)' })),
            state('code',       style({ transform: 'translateX(-33%)' })),
            state('password',   style({ transform: 'translateX(-33%)' })),
            state('done',       style({ transform: 'translateX(-33%)' })),
            state('logout',     style({ transform: 'translateX(-66%)' })),

            // order matter
            transition('login <=> register, registered => login',[
                group([
                    query('@move', animateChild()),
                    query('@moveText', animateChild()),
                    query('@registered', animateChild())])]),

            transition('reset => code',[
                query('@moveResetDigits', animateChild())]),

            transition('* => reset', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(0)', offset: 0}),
                    style({ transform: 'translateX(-32.7%)', offset: 0.2}),
                    style({ transform: 'translateX(-33%)',  offset: 1})]))]),

            transition('login <=> logout', [
                animate('600ms', keyframes([
                    style({ opacity: '100%', transform: 'translateX(0)', offset: 0 }),
                    style({ opacity: '0%', transform: 'translateX(-65.3%)', offset: 0.2 }),
                    style({ opacity: '100%', transform: 'translateX(-66%)', offset: 1 })]))]),


            transition('* => login', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(-33)', offset: 0}),
                    style({ transform: 'translateX(-0.3%)', offset: 0.2}),
                    style({ transform: 'translateX(0%)',  offset: 1})]))]),
          ]),

        trigger('move', [
            state('login, reset',        style({ height: '149px' })),
            state('register, registered', style({ height: '229px', transform: 'translateY(0)' })),
            transition('login <=> register,registered => login', animate('300ms ease-out')),
            transition('register => registered',[
                query('@registered', animateChild())]),

        ]),

        trigger('moveText', [
            state('login',                 style({ 'margin-top': '5px' })),
            state('register, registered',   style({  'margin-top': '33px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('moveResetDigits', [
            state('reset, login',            style({ height: '80px' })),
            state('code, password, done',   style({ height: '149px' })),

            transition('reset => code',
                animate("400ms", keyframes([
                    style({ height: '80px', offset: 0 }),
                    style({ height: '140px', offset: 0.3 }),
                    style({ height: '149px', offset: 1 })]))),

            transition('code => password',[
                query('@showPassword', animateChild())]),

        ]),

        trigger('registered', [
            state('registered',  style({transform: 'translateY(-{{top}}%)' }), { params: {top:200 } }),
            state('login',      style({transform: 'translateY(0)' }), { params: {top:200 } }),

            transition('register => registered', [
                animate("1000ms", keyframes([
                    style({ opacity:"100%",     transform: 'translateY(0)', offset: 0}),
                    style({ opacity:"0",        transform: 'translateY(0)', offset: 0.3}),
                    style({ opacity:"0",        transform: 'translateY(-{{top}}%)', offset: 0.35}),
                    style({ opacity:"100%",     transform: 'translateY(-{{top}}%)', offset: 1})]))]),

            transition("registered => login", [
                animate("400ms", keyframes([
                    style({ opacity:"100%",   transform: 'translateY(-{{top}}%)', offset: 0}),
                    style({ opacity:"0%",    transform: 'translateY(-{{top}}%)', offset: 0.3}),
                    style({ opacity:"0%",    transform: 'translateY(0)', offset: 0.7}),
                    style({ opacity:"100%",   transform: 'translateY(0)', offset: 1})]))])
            ]),

        trigger('showPassword', [
            state('code',       style({ transform: 'translateY(0%)' })),
            state('password',   style({ transform: 'translateY(-{{top}}%)' }), { params: { top: 120 } }), // variable sneed defaoult values
            state('done',       style({ transform: 'translateY(-{{done}}%)' }), { params: { top: 120, done:220 } }),

            transition("code => password", [
                animate("1600ms", keyframes([
                    style({ opacity:"100%",     transform: 'translateY(0%)', offset: 0}),
                    style({ opacity:"0%",       transform: 'translateY(0%)', offset: 0.3}),
                    style({ opacity:"0%",       transform: 'translateY(-{{top}}%)', offset: 0.35}),
                    style({ opacity:"100%",     transform: 'translateY(-{{top}}%)', offset: 1})]))]),

            transition("password => done", [
                    animate("1600ms", keyframes([
                    style({ opacity:"100%",     transform: 'translateY(-{{top}}%)', offset: 0}),
                    style({ opacity:"0%",       transform: 'translateY(-{{top}}%)', offset: 0.3}),
                    style({ opacity:"0%",       transform: 'translateY(-{{done}}%)', offset: 0.35}),
                    style({ opacity:"100%",     transform: 'translateY(-{{done}}%)', offset: 1})]))])

        ])

    ]
})
export class LoginComponent implements OnInit,OnDestroy {

    loading$: Observable<boolean> = this.store.pipe(select(getLoading));
    screen$: Observable<LoginScreen> = this.store.pipe(select(getScreen));
    message$: Observable<string> = this.store.pipe(select(getMessage),tap(x=>console.log("TRIGGGGERD")));
    loggedIn$: Observable<User> = this.store.pipe(select(getUser), skip(1), filter(user => Boolean(user)));


    test: number = 120;
    state = new State();

    login: FormGroup;
    reset: FormGroup;
    PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\&\+\,\:\;\=\?\#\$\!\=\*\'\@])\S{6,12}$/;
    MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    secondButton: Button = 'Sign Up'
    mainButton: Button = 'Sign In';
    help: string = 'Dont have an account?';
    loading: boolean;
    subscriptions: Subscription;
    message: string = undefined;

    activePane:LoginScreen;
    resetButton: string = 'Send Email';

    get loginForm() { return this.login.controls; }
    get resetForm() { return this.reset.controls; }

    constructor(private fb: FormBuilder,
                private authService: AuthenticationService,
                private chDet: ChangeDetectorRef,
                private store: Store<UserState>,
                public dialogRef: MatDialogRef<LoginComponent>,
    ) {

        this.login = fb.group(
          {
              email:            ["arkadi.daschkewitsch@gmail.com", [Validators.required, Validators.pattern(this.MAIL_PATTERN)]],
              password:         ["Test123!", [Validators.required, this.conditionalValidator(Validators.pattern(this.PASSWORD_PATTERN)).bind(this)]],
              confirmPassword:  ["Test123!", [Validators.pattern(this.PASSWORD_PATTERN)]],
              forgotPassword:[]
          },
          {
              validator: MustMatch('password', 'confirmPassword')  // Adding cross-validation
          });


        this.reset = fb.group(
            {
                resetEmail:             [null, [Validators.pattern(this.MAIL_PATTERN)]],
                resetCode:               null,
                resetPassword:          [null, [Validators.pattern(this.PASSWORD_PATTERN)]],
                confirmResetPassword:   [null, [Validators.pattern(this.PASSWORD_PATTERN)]]
            },
            {
                validator: MustMatch('resetPassword', 'confirmResetPassword') // Adding cross-validation
            });

  }



  ngOnInit(): void {

      this.subscriptions = this.screen$.subscribe(screen => this.switchScreen(screen));
      this.subscriptions
      .add(this.loggedIn$.pipe(delay(2000)).subscribe(() => this.dialogRef.close()))
      .add(this.loading$.pipe(tap(this.controlForm)).subscribe())
      .add(this.message$.subscribe(m => {
          console.log(m);
          this.message = m;
      }));

      this.resetForm['resetCode'].disable();
      this.resetForm['resetPassword'].disable();
      this.resetForm['confirmResetPassword'].disable();
  }

    ngOnDestroy(): void {
        this.store.dispatch(hideScreen())
        this.subscriptions.unsubscribe();
    }

    onLoginSubmit() {

      const email = this.login.get('email').value,
          password = this.login.get('password').value,
          confirmedPassword = this.login.get('confirmPassword').value;

      if (this.activePane === 'login') {

          this.store.dispatch(login({ email, password }))

      } else if (this.activePane === 'register') {

          this.store.dispatch(register({ email, password, confirmedPassword }))

      } else if(this.activePane === 'registered'){
          this.store.dispatch(switchScreen({ screen: 'login' }))
      }
  }

    firstScreenState(screen?: LoginScreen) {

        if (screen) {
           this.store.dispatch(switchScreen({ screen }))
        } else {
            switch (this.activePane) {
                case 'login': this.store.dispatch(switchScreen({screen:'register'})); break;
                case 'done':
                case 'code':
                case 'reset':
                case 'password':
                case 'register':
                case 'registered':
                    this.store.dispatch(switchScreen({ screen: 'login' }));
            }
        }
    }



    secondScreenState(validCode?: FormGroup) {

        switch (this.activePane) {
            case 'reset':      this.store.dispatch(switchScreen({screen:'code'})); break;
            case 'password':   this.store.dispatch(switchScreen({screen:'done'})); break;
            case 'code':       if(validCode?.valid) this.store.dispatch(switchScreen({screen:'password'}));break;
            case 'done':
                this.store.dispatch(switchScreen({screen:'login'}));
                this.resetForm.resetCode.reset();
                this.reset.reset();
        }

        // do some service stuff here, resend email again if missing ...
    }


    // ===== helper ====== //

    private switchScreen(screen: LoginScreen) {
        switch(screen) {
            case 'login': {
                this.state.onLogin();
                this.reset.reset();
                this.activePane='login';

                this.mainButton = 'Sign In'
                this.secondButton = 'Sign Up';
                this.help = 'Dont have an account?';

                this.loginForm.email.enable();
                this.loginForm.password.enable();
                this.loginForm.confirmPassword.disable();
                break;
            }
            case 'logged-in': {
                this.state.onLongedIn();
                this.reset.reset();
                this.activePane='logged-in';

                this.loginForm.email.disable();
                this.loginForm.password.disable();
                this.loginForm.confirmPassword.disable();
                break;
            }
            case 'register': {
                this.state.onRegister();
                this.activePane='register';
                this.loginForm.confirmPassword.enable();

                this.mainButton = 'Sign Up'
                this.secondButton = 'Sign In';
                this.help = 'Already registered?';
                break;
            }
            case 'registered': {
                this.state.onDone();
                this.activePane = 'registered';
                this.mainButton = 'Return'

                this.loginForm.password.disable();
                this.loginForm.confirmPassword.disable();
                break;
            }
            case 'reset': {
                this.state.onReset();
                this.login.reset();
                this.activePane = 'reset';
                this.resetButton = 'Send Email';
                this.resetForm.resetEmail.enable();

                this.resetForm.resetCode.disable();
                this.resetForm.resetPassword.disable();
                this.resetForm.confirmResetPassword.disable();
                break;
            }
            case 'code': {
                this.state.onCode();
                this.activePane = 'code';
                this.resetButton = 'Resend Email';
                this.resetForm.resetCode.enable();


                this.resetForm.resetPassword.disable();
                this.resetForm.confirmResetPassword.disable();
                break;
            }
            case 'password': {
                this.state.onPassword();
                this.activePane = 'password';
                this.resetButton = 'Change Password';

                this.resetForm.resetPassword.enable();
                this.resetForm.confirmResetPassword.enable();

                this.resetForm.resetEmail.disable();
                this.resetForm.resetCode.disable();
                break;
            }
            case 'done': {
                this.state.onDone();
                this.activePane = 'done';
                this.resetButton = 'Return';

                this.resetForm.resetPassword.disable();
                this.resetForm.confirmResetPassword.disable();
                break;
            }
            case 'logout':
            default: {
                this.dialogRef.close()

                this.state.onLogout();
                this.activePane = 'logout';
                this.resetButton = 'Return';

                this.loginForm.email.disable();
                this.loginForm.password.disable();
            }
        }

    }


    private conditionalValidator(validators: ValidatorFn | ValidatorFn[]): ValidatorFn {
        return (control) => {

            if (this.activePane!=='register') return null;

            else if (!Array.isArray(validators)) return validators(control);

            else return validators
                    .map(v => v(control))
                    .reduce((errors, result) =>
                        result === null ? errors : (Object.assign(errors || {}, result)));

        };
    }

    controlForm = (loading) => {
        if (loading) {
            this.login.disable();
            this.reset.disable();
        } else {
            this.login.enable();
            this.reset.enable();
        }
    }
}

class State {

    login     = {index: -1}
    register  = {index: -1}
    registered = {index: -1}

    reset     = {index: -1}
    code      = {index: -1}
    password  = {index: -1}
    done      = {index: -1}

    logout    = {index: -1}

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

}


// custom validator to confirmed that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {

        const control = formGroup.controls[controlName],
            matchingControl = formGroup.controls[matchingControlName];

        // fierds must be enabled, skip validation
        if (control.disabled && matchingControl.disabled) return;

        // return if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors.mustMatch) return;

        // set error on matchingControl if validation fails
        control.value !== matchingControl.value?
            matchingControl.setErrors({ mustMatch: true }):
            matchingControl.setErrors(null);
    }
}


