import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';
import { animate, keyframes, state, style, transition, trigger, query, animateChild } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { log } from 'util';

type screenType = 'login' | 'reset' | 'register' | 'code';
type Button = 'Sign In' | 'Sign Up';

@Component({
    selector: 'app-login',
    templateUrl: './login-tool-bar.component.html',
    styleUrls: ['./login-tool-bar.component.scss'],
    animations: [
        trigger('move', [
            state('login', style({ height: '80px' })),
            state('register', style({ height: '150px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('moveText', [
            state('login', style({ 'margin-top': '5px' })),
            state('register', style({  'margin-top': '33px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('slide', [
            state('login', style({ transform: 'translateX(0)' })),
            state('reset', style({ transform: 'translateX(-50%)' })),
            state('code', style({ transform: 'translateX(-50%)' })),

            transition('reset => code',[
                query('@moveResetDigits', animateChild())]),

            transition('* => reset', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(0)', offset: 0}),
                    style({ transform: 'translateX(-49.7%)', offset: 0.2}),
                    style({ transform: 'translateX(-50%)',  offset: 1})]))]),

            transition('reset => *', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(-50)', offset: 0}),
                    style({ transform: 'translateX(-0.3%)', offset: 0.2}),
                    style({ transform: 'translateX(0%)',  offset: 1})]))]),

            transition('code => *', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(-50)', offset: 0}),
                    style({ transform: 'translateX(-0.3%)', offset: 0.2}),
                    style({ transform: 'translateX(0%)',  offset: 1})]))]),
          ]),


        trigger('moveResetDigits', [
            state('reset', style({ height: '80px'})),
            state('code', style({ height: '160px'})),
            transition('reset => code',
                animate("500ms",keyframes([
                    style({ height: '80px', offset: 0}),
                    style({ height: '156px', offset: 0.2}),
                    style({ height: '160px',  offset: 1})])))])

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

                resetCode: this.fb.group({
                    one:    [, [Validators.pattern(/[0-9A-Z]/)]],
                    two:    [, [Validators.pattern(/[0-9A-Z]/)]],
                    three:  [, [Validators.pattern(/[0-9A-Z]/)]],
                    four:   [, [Validators.pattern(/[0-9A-Z]/)]] }),

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

  }

  onLoginSubmit() {
      const email = this.login.get('email').value,
          password = this.login.get('password').value;

      this.authService.login(email, password)
          .subscribe(() => console.log('user is logged in'));
  }

    onResetSubmit() {

        const email = this.reset.get('resetEmail').value;

        // do some service stuff  ...

        this.switchState('code');

    }

    switchState(reset?: screenType) {
        console.log("called",reset)
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

    private switchScreen(screen: screenType) {
        if (screen === 'login') {
            this.activePane='login';

            this.mainButton = 'Sign In'
            this.secondButton = 'Sign Up';
            this.help = 'Dont have an account?';
            this.loginForm.confirmPassword.disable();

        } else if (screen === 'register') {
            this.activePane='register';

            this.mainButton = 'Sign Up'
            this.secondButton = 'Sign In';
            this.help = 'Already registered?';
            this.loginForm.confirmPassword.enable();

        } else if (screen === 'reset') {
            this.activePane = 'reset';

            this.resetForm.resetCode.disable();
            this.resetForm.resetPassword.disable();
            this.resetForm.confirmResetPassword.disable();

        } else if (screen === 'code') {
            this.activePane = 'code';
            this.resetForm.resetCode.enable();
            this.resetForm.resetPassword.enable();
            this.resetForm.confirmResetPassword.enable();

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


// custom validator to check that two fields match
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


