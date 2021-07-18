import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {UserState} from "../../state/user/user.reducers";
import {StateService} from "../user-state-service";
import {UserScreen, mustMatch} from "../user.model";
import {clearMessage, getResetCode, resetPassword, switchScreen, validateResetCode}
  from "../../state/user/user.actions";
import {Observable} from "rxjs";
import {getLoading} from "../../state/user/user.selectors";
import {moveResetDigits, showPassword} from "./reset.animations";
import {AppValidators} from "../../common/validation/validator";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default,
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
          resetEmail: [null, [AppValidators.email]],
          resetCode: {value: null, disabled: true},
          resetPassword: [null, [AppValidators.validatePassword]],
          confirmResetPassword: [null, [AppValidators.validatePassword]]
        },
        {
          validator: mustMatch('resetPassword', 'confirmResetPassword') // Adding cross-validation
        });

  }


  resetPasswordScreen() {

    switch (this.state.activePaneSubject.value) {

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
      switch (this.state.activePaneSubject.value) {
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



  get passwordError(){
    return this.state.resetPassword?.errors?.validatePassword;
  }
  get confirmPasswordError(){

    if (this.state.confirmedResetPassword?.errors?.validatePassword) {
      return this.state.confirmedResetPassword?.errors.validatePassword;
    } else if (this.state.confirmedResetPassword?.errors?.mustMatch) {
      return this.state.confirmedResetPassword?.errors.mustMatch;
    }
  }

  getResetPassword = () => ({
    email: this.state.resetEmail,
    password: this.state.resetPassword.value,
    confirmedPassword: this.state.confirmedResetPassword.value
  });



  onFocus() {
    if (this.state.resetForm.invalid) {
      this.store.dispatch(clearMessage())
      this.state.resetControls.resetPassword.updateValueAndValidity()
      this.state.resetControls.confirmResetPassword.updateValueAndValidity()
    }
  }

  ngOnInit(): void {
  }

}
