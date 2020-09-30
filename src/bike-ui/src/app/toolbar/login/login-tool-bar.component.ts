import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';
import { animate, keyframes, state, style, transition, trigger, query, animateChild, group, stagger } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { log } from 'util';

type ScreenType = 'login' | 'logged-in' | 'reset' | 'register' | 'registerd'| 'code' | 'password'| 'done';
type Button = 'Sign In' | 'Sign Up'| 'Return';


// trigger('detailExpand', [
//     state('collapsed, void', style({ height: '0px', minHeight: '0' })),
//     state('expanded', style({ height: '*' })),
//     transition('expanded <=> void, expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
// ])

@Component({
    selector: 'app-login',
    templateUrl: './login-tool-bar.component.html',
    styleUrls: ['./login-tool-bar.component.scss'],
    animations: [

        trigger('slide', [
            state('login',      style({ transform: 'translateX(0)' })),
            state('register',   style({ transform: 'translateX(0)' })),
            state('registerd',  style({ transform: 'translateX(0)' })),
            state('reset',      style({ transform: 'translateX(-50%)' })),
            state('code',       style({ transform: 'translateX(-50%)' })),
            state('password',   style({ transform: 'translateX(-50%)' })),
            state('done',       style({ transform: 'translateX(-50%)' })),

            // order matter
            transition('login <=> register, registerd => login',[
                group([
                    query('@move', animateChild()),
                    query('@moveText', animateChild()),
                    query('@registerd', animateChild())])]),

            transition('reset => code',[
                query('@moveResetDigits', animateChild())]),

            transition('* => reset', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(0)', offset: 0}),
                    style({ transform: 'translateX(-49.7%)', offset: 0.2}),
                    style({ transform: 'translateX(-50%)',  offset: 1})]))]),

            transition('* => login', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(-50)', offset: 0}),
                    style({ transform: 'translateX(-0.3%)', offset: 0.2}),
                    style({ transform: 'translateX(0%)',  offset: 1})]))]),
          ]),


        trigger('move', [
            state('login',               style({ height: '149px' })),
            state('reset',               style({ height: '149px' })), // hide stuff on transition
            state('register, registerd', style({ height: '229px',transform: 'translateY(0)' })),
            transition('login <=> register,registerd=>login', animate('300ms ease-out')),
            transition('register => registerd',[
                query('@registerd', animateChild())]),

        ]),

        trigger('moveText', [
            state('login',                 style({ 'margin-top': '5px' })),
            state('register, registerd',   style({  'margin-top': '33px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('moveResetDigits', [
            state('reset,login',          style({ height: '80px' })),
            state('code,password,done',   style({ height: '149px' })),

            transition('reset => code',
                animate("400ms", keyframes([
                    style({ height: '80px', offset: 0 }),
                    style({ height: '140px', offset: 0.3 }),
                    style({ height: '149px', offset: 1 })]))),

            transition('code => password',[
                query('@showPassword', animateChild())]),

        ]),

        trigger('registerd', [
            state('registerd',  style({transform: 'translateY(-{{top}}%)' }), { params: {top:200 } }),
            state('login',      style({transform: 'translateY(0)' }), { params: {top:200 } }),

            transition('register => registerd', [
                animate("1000ms", keyframes([
                    style({ opacity:"100%",     transform: 'translateY(0)', offset: 0}),
                    style({ opacity:"0",        transform: 'translateY(0)', offset: 0.3}),
                    style({ opacity:"0",        transform: 'translateY(-{{top}}%)', offset: 0.35}),
                    style({ opacity:"100%",     transform: 'translateY(-{{top}}%)', offset: 1})]))]),

            transition("registerd => login", [
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

        ]),

    ]
})


export class LoginToolBarComponent implements OnInit {

    test:number = 120;
    state = new State();
    login: FormGroup;
    reset: FormGroup;
    PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\&\+\,\:\;\=\?\#\$\!\=\*\'\@])\S{6,12}$/;
    MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    secondButton: Button = 'Sign Up'
    mainButton: Button = 'Sign In';
    help: string = 'Dont have an account?';


    screen: BehaviorSubject<ScreenType> = new BehaviorSubject('login');
    activePane: ScreenType = 'login';
    textBold: ScreenType;
    resetButton: string = 'Send Email';

    get loginForm() { return this.login.controls; }
    get resetForm() { return this.reset.controls; }

    constructor(private fb: FormBuilder, private authService: AuthenticationService) {

        this.login = fb.group(
          {
              email:            ["tes@de.de", [Validators.required, Validators.pattern(this.MAIL_PATTERN)]],
              password:         ["Test123!", [Validators.required, this.conditionalValidator(Validators.pattern(this.PASSWORD_PATTERN)).bind(this)]],
              confirmPassword:  ["Test123!", [Validators.pattern(this.PASSWORD_PATTERN)]]
          },
          {
              validator: MustMatch('password', 'confirmPassword')  // Adding cross-validation
          });


        this.reset = fb.group(
            {
                resetEmail:             [null, [Validators.pattern(this.MAIL_PATTERN)]],
                resetCode:              null,
                resetPassword:          [null, [Validators.pattern(this.PASSWORD_PATTERN)]],
                confirmResetPassword:   [null, [Validators.pattern(this.PASSWORD_PATTERN)]]
            },
            {
                validator: MustMatch('resetPassword', 'confirmResetPassword') // Adding cross-validation
            });

  }

  ngOnInit(): void {
      this.screen.asObservable().subscribe(screen => {
          console.log('ON SCREEN: ', screen);
          this.switchScreen(screen);
      });

      this.resetForm['resetCode'].disable();
      this.resetForm['resetPassword'].disable();
      this.resetForm['confirmResetPassword'].disable();

  }

  onLoginSubmit() {
      const email = this.login.get('email').value,
          password = this.login.get('password').value,
          confirmPassword = this.login.get('confirmPassword').value;
      console.log("me clicked ")

      if (this.screen.value === 'login') {
          console.log("me in login state ")

          // this.authService.login(email, password)
          //     .subscribe(
          //         (r) => {
          //             this.screen.next('logged-in');
          //             console.log('user is logged in'+r)},
          //         (e)  => console.log('failed :' + e));

      } else if (this.screen.value === 'register') {
          this.screen.next('registerd');
          console.log("me in registerd state ")
          //
          // this.authService.register(email, password, confirmPassword)
          //     .subscribe(
          //         (r) => {
          //           console.log('register success:'+r);
          //           this.screen.next('registerd')},
          //         (e) => console.log('failed :' + e));
      }else if(this.screen.value === 'registerd'){
          this.screen.next('login');
      }


  }

    switchButtonLabel(screen?: ScreenType) {
        if (this.screen.value === 'password') {
            this.screen.next('done');
        } else if (this.screen.value === 'done') {
            this.screen.next('login');
            this.resetForm.resetCode.reset();
            this.reset.reset();

        } else {
            this.screen.next(screen);
        }

        // do some service stuff here, resend email agian if missing ...

    }


    switchState(reset?: ScreenType) {
        if (reset) {
            this.screen.next(reset);
        } else {
            switch (this.screen.value) {
                case 'login':
                    this.screen.next('register');
                    break;
                case 'register':
                    this.screen.next('login');
                    break;
            }
        }
    }


    // ===== helper

    private switchScreen(screen: ScreenType) {

        switch(screen) {
            case 'login': {
                this.state.onLogin();
                this.activePane='login';

                this.mainButton = 'Sign In'
                this.secondButton = 'Sign Up';
                this.help = 'Dont have an account?';

                this.loginForm.password.enable();
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
            case 'registerd': {
                this.state.onDone();
                this.activePane = 'registerd';
                this.mainButton = 'Return'

                this.loginForm.password.disable();
                this.loginForm.confirmPassword.disable();
                break;
            }
            case 'reset': {
                this.state.onReset();
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
            default: {
                //statements;
                break;
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

}

class State {

    login     = {index: -1}
    register  = {index: -1}
    registerd = {index: -1}

    reset     = {index: -1}
    code      = {index: -1}
    password  = {index: -1}
    done      = {index: -1}

    onLogin() {
        this.login.index    =  0;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };

    onRegister() {
        this.login.index    =  0;
        this.register.index =  0;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index = -1;
    };

    onReset() {
        this.login.index    = -1;
        this.register.index = -1;
        this.reset.index    =  0;
        this.code.index     = -1;
        this.password.index = -1;
    };

    onCode() {
        this.login.index    = -1;
        this.register.index = -1;
        this.reset.index    =  0;
        this.code.index     =  0;
        this.password.index = -1;
    };

    onPassword() {
        this.login.index    = -1;
        this.register.index = -1;
        this.reset.index    = -1;
        this.code.index     = -1;
        this.password.index =  0;
    };
    onDone() {
        this.login.index    = -1;
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


