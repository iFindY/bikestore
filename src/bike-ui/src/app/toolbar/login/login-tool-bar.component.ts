import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login-tool-bar.component.html',
  styleUrls: ['./login-tool-bar.component.scss']
})
export class LoginToolBarComponent implements OnInit {

    loginForm: FormGroup;
    passwordPattern = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\&\+\,\:\;\=\?\#\$\!\=\*\'\@])\S{6,12}$/;
    mailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    emailFocus: boolean;
    passwordFocus: boolean;
    loginFailed: boolean = false;



  constructor(private fb: FormBuilder,
              private authService:AuthenticationService) {

      this.loginForm = fb.group(
          {
            email: [, [Validators.required,Validators.pattern(this.mailPattern)]],
            password: [, [Validators.required, Validators.pattern(this.passwordPattern)]]
          })
  }

  ngOnInit(): void {

    //INWORK  just for logging
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



}

