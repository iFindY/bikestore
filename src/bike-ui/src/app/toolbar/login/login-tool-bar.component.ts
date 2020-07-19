import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
type PassType = 'login' | 'register';
type screenType = 'login' | 'reset';
type Button = 'Sign In' | 'Sign Up';

@Component({
    selector: 'app-login',
    templateUrl: './login-tool-bar.component.html',
    styleUrls: ['./login-tool-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('move', [
            state('login', style({ height: '70px' })),
            state('register', style({ height: '136px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('moveResetDigits', [
            state('sendMail', style({ height: '20px' })),
            state('enterDigits', style({ height: '70px' })),
            transition('sendMail <=> enterDigits', animate('300ms ease-out'))]),


        trigger('moveText', [
            state('login', style({ 'margin-top': '5px' })),
            state('register', style({  'margin-top': '33px' })),
            transition('login <=> register', animate('300ms ease-out'))]),

        trigger('slide', [
            state('login', style({ transform: 'translateX(0)' })),
            state('reset', style({ transform: 'translateX(-50%)' })),
            transition('login => reset', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(0)', offset: 0}),
                    style({ transform: 'translateX(-49.7%)', offset: 0.2}),
                    style({ transform: 'translateX(-50%)',  offset: 1}),]))]),
            transition('reset => login', [
                animate("600ms", keyframes([
                    style({ transform: 'translateX(-50)', offset: 0}),
                    style({ transform: 'translateX(-0.3%)', offset: 0.2}),
                    style({ transform: 'translateX(0%)',  offset: 1}),]))])])
    ]

})
export class LoginToolBarComponent implements OnInit {


    loginForm: FormGroup;
    passwordPattern = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\&\+\,\:\;\=\?\#\$\!\=\*\'\@])\S{6,12}$/;
    mailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    emailFocus: boolean;
    passwordFocus: boolean;
    confirmPasswordFocus: boolean;
    loginFailed: boolean = false;
    passPane: PassType = 'login';
    secondButton: Button = 'Sign Up'
    mainButton: Button = 'Sign In';
    help: string = 'Dont have an account?';

    activePane: screenType = 'login';
    textBold: screenType;


    constructor(private fb: FormBuilder,
              private authService:AuthenticationService) {

        this.loginForm = fb.group(
          {
              email: [, [Validators.pattern(this.mailPattern)]],
              password: [, [ Validators.pattern(this.passwordPattern)]],
              confirmPassword: [, [ Validators.pattern(this.passwordPattern)]]

          })
  }

  ngOnInit(): void {

    //INWORK just for logging
    this.loginForm.statusChanges
        .pipe(
            filter(status => status === 'VALID'),
            tap(status => console.log(status, JSON.stringify(this.loginForm.value))))
        .subscribe();
  }

  onSubmit() {
    const email = this.loginForm.get('email').value,
        password = this.loginForm.get('password').value;

    this.authService.login(email, password)
        .subscribe(() => console.log('user is logged in'));
  }

    setEmailFocused(stat:boolean) {
        this.emailFocus = stat;
    };

    setConfirmPasswordFocused(stat:boolean) {
        this.confirmPasswordFocus = stat;
    };
    setPasswordFocused(stat:boolean) {
        this.passwordFocus = stat;
    };


    switchScreen() {
        if (this.passPane === 'register') {
            this.passPane = 'login';
            this.mainButton = 'Sign In'
            this.secondButton = 'Sign Up';
            this.help='Dont have an account?';
        } else {
            this.passPane = 'register';
            this.mainButton = 'Sign Up'
            this.secondButton = 'Sign In';
            this.help='Already registered?';

        }
    }

    get invalid():boolean {
        if(!!!this.loginForm ) return false;

        let login =
            !!this.loginForm.get('email').value &&
            !!this.loginForm.get('password').value &&
            this.loginForm.valid;

        return this.passPane !== 'register' ? !login:
            !(login && !!this.loginForm.get('confirmPassword').value);

    }
}

