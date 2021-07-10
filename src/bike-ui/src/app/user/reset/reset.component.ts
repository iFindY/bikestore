import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {UserState} from "../../state/user/user.reducers";
import {StateService} from "../user-state-service";
import {UserScreen, mustMatch} from "../user.model";
import {getResetCode, resetPassword, switchScreen, validateResetCode}
  from "../../state/user/user.actions";
import {Observable} from "rxjs";
import {getLoading} from "../../state/user/user.selectors";
import {moveResetDigits, showPassword} from "./reset.animations";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  animations: [showPassword, moveResetDigits]
})
export class ResetComponent implements OnInit {


  PASSWORD_PATTERN = /^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[&+,:;=?#$§"%&/()`!*'@])\S{6,12}$/;
  MAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  ANIMATION_PARAMETER: number = 120;


  loading$: Observable<{ login: boolean, reset: boolean }> = this.store.pipe(select(getLoading));

  constructor(private fb: FormBuilder,
              private chDet: ChangeDetectorRef,
              private store: Store<UserState>,
              public state: StateService) {

    state.resetForm = fb.group(
        {
          resetEmail: [null, [Validators.pattern(this.MAIL_PATTERN)]],
          resetCode: [],
          resetPassword: [null, [Validators.pattern(this.PASSWORD_PATTERN)]],
          confirmResetPassword: [null, [Validators.pattern(this.PASSWORD_PATTERN)]]
        },
        {
          validator: mustMatch('resetPassword', 'confirmResetPassword') // Adding cross-validation
        });

  }


  resetPasswordScreen() {

    switch (this.state.activePane) {

      case 'reset':
        this.store.dispatch(getResetCode({email: this.state.resetEmail}));
        break;

      case 'code' :
        this.state.resetControls.resetCode.valid ?
            this.store.dispatch(validateResetCode({
              code: this.state.resetCode,
              email: this.state.resetEmail
            })) :
            this.store.dispatch(getResetCode({email: this.state.resetEmail}));
        break;

      case 'password':
        this.store.dispatch(resetPassword(this.getResetPassword()));
        break;

      case 'done':
        this.store.dispatch(switchScreen({screen: 'login'}));
        break;
    }
  }


  loginRegisterScreen(screen?: UserScreen) {

    if (screen) { // we set the screen or else  default to login register
      this.store.dispatch(switchScreen({screen}))
    } else {
      switch (this.state.activePane) {
        case 'reset':
        case 'password':
        case 'register':
        case 'code':
        case 'done':
        case 'registered' :
          this.store.dispatch(switchScreen({screen: 'login'}));
          break;
        case 'login':
          this.store.dispatch(switchScreen({screen: 'register'}));
          break;
      }
    }
  }

  get rpBtnValidation(): boolean {

    return this.state.resetCodeControl.enabled ?
        false :
        this.state.resetCodeControl.invalid
  }


  getResetPassword = () => ({
    email: this.state.resetEmail,
    password: this.state.resetPassword,
    confirmedPassword: this.state.confirmedResetPassword
  });


  ngOnInit(): void {
  }

}
