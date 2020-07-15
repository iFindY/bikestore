import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
type PassType = 'login' | 'register';

@Component({
    selector: 'app-login',
    templateUrl: './login-tool-bar.component.html',
    styleUrls: ['./login-tool-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slide', [
            state('left', style({ transform: 'translateX(0)' })),
            state('right', style({ transform: 'translateX(-50%)' })),
            transition('* => *', animate('250ms ease-out')
            )
        ]),
        trigger('move',
            [state('login', style({ height: '70px' })),
                state('register', style({ height: '136px' })),
                transition('* => *', animate('300ms ease-out'))],
            )
    ]

})
export class LoginToolBarComponent implements OnInit {


    loginForm: FormGroup;
    passwordPattern = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\&\+\,\:\;\=\?\#\$\!\=\*\'\@])\S{6,12}$/;
    mailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    emailFocus: boolean;
    passwordFocus: boolean;
    loginFailed: boolean = false;
    passPane: PassType = 'login';


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

    setPasswordFocused(stat:boolean) {
        this.passwordFocus = stat;
    };

    switchScreen() {
        this.passPane = this.passPane==='register'?'login':'register';
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

