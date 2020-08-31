import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';
import { animate, keyframes, state, style, transition, trigger, query, animateChild } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { log } from 'util';

type screenType = 'login' | 'reset' | 'register' | 'code' | 'password';
type Button = 'Sign In' | 'Sign Up';

@Component({
    selector: 'app-login',
    templateUrl: './login-tool-bar.component.html',
    styleUrls: ['./login-tool-bar.component.scss'],
    animations: [
        trigger('move', [
            state('login',      style({ height: '80px' })),
            state('register',   style({ height: '150px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('moveText', [
            state('login',      style({ 'margin-top': '5px' })),
            state('register',   style({  'margin-top': '33px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('slide', [
            state('login',      style({ transform: 'translateX(0)' })),
            state('reset',      style({ transform: 'translateX(-50%)' })),
            state('code',       style({ transform: 'translateX(-50%)' })),
            state('password',   style({ transform: 'translateX(-50%)' })),

            // order matter
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

        trigger('moveResetDigits', [
            state('reset',      style({ height: '80px' })),
            state('code',       style({ height: '150px' })),
            state('password',   style({ height: '150px' })),

            transition('reset => code',
                animate("400ms", keyframes([
                    style({ height: '80px', offset: 0 }),
                    style({ height: '140px', offset: 0.3 }),
                    style({ height: '150px', offset: 1 })]))),

            transition('code => password',[
                query('@showPassword', animateChild())]),

        ]),

        trigger('showPassword', [
            state('code',       style({transform: 'translateY(0%)' })),
            state('password',   style({ transform: 'translateY(-{{top}}%)' }), { params: { top: 120 } }),

            transition('code => password', [
                animate("1600ms", keyframes([
                    style({ opacity:"100%", transform: 'translateY(0)', offset: 0}),
                    style({ opacity:"0%",   transform: 'translateY(0)', offset: 0.3}),
                    style({ opacity:"0%",   transform: 'translateY(-{{top}}%)', offset: 0.35}),
                    style({ opacity:"100%",   transform: 'translateY(-{{top}}%)', offset: 1})]))])
        ]),


    ]
})


export class LoginToolBarComponent implements OnInit {


    login: FormGroup;
    reset: FormGroup;
    PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\&\+\,\:\;\=\?\#\$\!\=\*\'\@])\S{6,12}$/;
    MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    secondButton: Button = 'Sign Up'
    mainButton: Button = 'Sign In';
    help: string = 'Dont have an account?';

    screen: BehaviorSubject<screenType> = new BehaviorSubject('login');
    activePane: screenType = 'login';
    textBold: screenType;
    resetButton: string = 'Send Email';

    get loginForm() { return this.login.controls; }
    get resetForm() { return this.reset.controls; }

    constructor(private fb: FormBuilder, private authService: AuthenticationService) {

        this.login = fb.group(
          {
              email:            [, [Validators.required, Validators.pattern(this.MAIL_PATTERN)]],
              password:         [, [Validators.required, this.conditionalValidator(Validators.pattern(this.PASSWORD_PATTERN)).bind(this)]],
              confirmPassword:  [, [Validators.pattern(this.PASSWORD_PATTERN)]]
          },
          {
              validator: MustMatch('password', 'confirmPassword')  // Adding cross-validation
          });


        this.reset = fb.group(
            {
                resetEmail: ["de@de.de", [Validators.pattern(this.MAIL_PATTERN)]],
                resetCode:'',
                resetPassword:         [, [Validators.pattern(this.PASSWORD_PATTERN)]],
                confirmResetPassword:   [, [Validators.pattern(this.PASSWORD_PATTERN)]]
            },
            {
                validator: MustMatch('resetPassword', 'confirmResetPassword') // Adding cross-validation
            });

  }

  ngOnInit(): void {
      this.screen.asObservable().subscribe(screen => this.switchScreen(screen));

      this.resetForm['resetCode'].disable();
      this.resetForm['resetPassword'].disable();
      this.resetForm['confirmResetPassword'].disable();

      this.reset.valueChanges.subscribe(x=>console.log(JSON.stringify(x)));
  }

  onLoginSubmit() {
      const email = this.login.get('email').value,
          password = this.login.get('password').value;
      this.authService.login(email, password)
          .subscribe(() => console.log('user is logged in'));
  }

    switchButtonLabel(screen?: screenType) {

        // do some service stuff...
        const email = this.reset.get('resetEmail').value;

        // enter mail code... order can change
        this.switchState(screen);
    }


    switchState(reset?: screenType) {
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
    get sendResend(): string {

        if (this.activePane === 'password') {
            return 'Change Password';
        } else {
            return this.resetButton;
        }

    }

    private switchScreen(screen: screenType) {
        if (screen === 'login') {
            this.activePane='login';

            this.mainButton = 'Sign In'
            this.secondButton = 'Sign Up';
            this.help = 'Dont have an account?';
            this.loginForm.confirmPassword.disable();

        } else if (screen === 'register') {
            this.activePane='register';
            this.loginForm.confirmPassword.enable();

            this.mainButton = 'Sign Up'
            this.secondButton = 'Sign In';
            this.help = 'Already registered?';

        } else if (screen === 'reset') {
            this.activePane = 'reset';
            this.resetButton = 'Send Email';
            this.resetForm.resetEmail.enable();

            this.resetForm.resetCode.disable();
            this.resetForm.resetPassword.disable();
            this.resetForm.confirmResetPassword.disable();

        } else if (screen === 'code') {
            this.activePane = 'code';
            this.resetButton = 'Resend Email';
            this.resetForm.resetCode.enable();


            this.resetForm.resetPassword.disable();
            this.resetForm.confirmResetPassword.disable();

        }else if (screen === 'password') {
            this.activePane = 'password';
            this.resetForm.resetPassword.enable();
            this.resetForm.confirmResetPassword.enable();

            this.resetForm.resetEmail.disable();
            this.resetForm.resetCode.disable();
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


