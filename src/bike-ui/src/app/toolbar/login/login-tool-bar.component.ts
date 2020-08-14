import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';
import { log } from 'util';
type screenType = 'login' | 'reset' | 'register';
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

        trigger('moveResetDigits', [
            state('sendMail', style({ height: '20px' })),
            state('enterDigits', style({ height: '70px' })),
            transition('sendMail <=> enterDigits', animate('300ms ease-out'))]),


        trigger('slide', [
            state('login', style({ transform: 'translateX(0)' })),
            state('reset', style({ transform: 'translateX(-50%)' })),
            transition('* => reset', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(0)', offset: 0}),
                    style({ transform: 'translateX(-49.7%)', offset: 0.2}),
                    style({ transform: 'translateX(-50%)',  offset: 1}),]))]),
            transition('reset => *', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(-50)', offset: 0}),
                    style({ transform: 'translateX(-0.3%)', offset: 0.2}),
                    style({ transform: 'translateX(0%)',  offset: 1})]))])]),

        trigger('hintDrop', [
            transition(':enter',
                [
                    style({ transform: 'translateY(-100%)' }),
                    animate('300ms 100ms ease-out',
                        style({ transform: 'translateY(0)'}))]),])
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
    hidePassword: boolean = true;
    hideVerifyPassword: boolean = true;
    focused: boolean;

    get loginForm() { return this.login.controls; }
    get resetForm() { return this.reset.controls; }

    overPass: boolean;
    overMail:boolean;

    constructor(private fb: FormBuilder, private authService: AuthenticationService) {

        this.login = fb.group(
          {
              email: [, [Validators.required, Validators.pattern(this.MAIL_PATTERN)]],
              password: [, [Validators.required, this.conditionalValidator(Validators.pattern(this.PASSWORD_PATTERN)).bind(this)]],

              confirmPassword: [, [Validators.pattern(this.PASSWORD_PATTERN)]],
          }, { validator: MustMatch('password', 'confirmPassword') }); // Adding cross-validation


        this.reset = fb.group(
            {
                resetEmail: [, [Validators.pattern(this.MAIL_PATTERN)]],

                resetCode: this.fb.group({
                    one:    [, [Validators.pattern(/[0-9A-Z]/)]],
                    two:    [, [Validators.pattern(/[0-9A-Z]/)]],
                    three:  [, [Validators.pattern(/[0-9A-Z]/)]],
                    four:   [, [Validators.pattern(/[0-9A-Z]/)]],
                }),

                resetPassword:      [, [Validators.pattern(this.PASSWORD_PATTERN)]],
                confirmResetPassword:   [, [Validators.pattern(this.PASSWORD_PATTERN)]]
            }, { validator: MustMatch('resetPassword', 'confirmResetPassword') }) // Adding cross-validation


        this.login.valueChanges.subscribe(x => log(x));
  }

  ngOnInit(): void {
      this.screen.asObservable().subscribe(screen => this.switchScreen(screen))
  }

  onSubmit() {
      const email = this.login.get('email').value,
          password = this.login.get('password').value;

      this.authService.login(email, password)
          .subscribe(() => console.log('user is logged in'));
  }

    switchState(reset?: screenType) {
        if (reset) {
            this.screen.next(reset);}
        else {
            switch (this.screen.value) {
                case 'login':
                    this.screen.next('register');
                    break;
                case 'register':
                    this.screen.next('login');
                    break;}}
    }


    // ===== helper


    setFocus(f:boolean){
        this.focused = f;
    }
    private switchScreen(screen: screenType) {
        if (screen === 'login') {
            this.mainButton = 'Sign In'
            this.secondButton = 'Sign Up';
            this.help = 'Dont have an account?';
            this.activePane='login';
            this.loginForm.confirmPassword.disable();

        } else if (screen === 'register') {
            this.mainButton = 'Sign Up'
            this.secondButton = 'Sign In';
            this.help = 'Already registered?';
            this.activePane='register';
            this.loginForm.confirmPassword.enable();

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


