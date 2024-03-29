
export type UserScreen =
    'login' | 'logged-in' | 'logout' | 'register' | 'registered' |
    'reset' | 'code' | 'password' | 'done';

export type LoginWindow = 'login' | 'reset' | 'logout';

export type Button = 'Sign In' | 'Sign Up'| 'Return';

export interface User {
  username: string;
  roles: string[];
}

export interface Settings {
    name:string;
    age:number;
    class:string;
    active:boolean;
    image:string; // link
}




// == == == == functions


// custom validator to confirmed that two fields match
export function mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {

        const control = formGroup.controls[controlName],
            matchingControl = formGroup.controls[matchingControlName];

        // fields must be enabled, skip validation
        if (control.disabled || matchingControl.disabled) return;

        // return if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors?.mustMatch) return;

        // set error on matchingControl if validation fails
        control.value !== matchingControl.value?
            matchingControl.setErrors({ mustMatch: 'not matching' }):
            matchingControl.setErrors(null);
    }
}





// custom validator to confirmed that two fields match
import {FormGroup, ValidatorFn} from "@angular/forms";


// currently not used
export function conditionalValidator(activePane: UserScreen, validators: ValidatorFn | ValidatorFn[]): ValidatorFn {
    return (control) => {

        if (activePane!=='register') return null;

        else if (!Array.isArray(validators)) return validators(control);

        else return validators
            .map(v => v(control))
            .reduce((errors, result) =>
                result === null ? errors : (Object.assign(errors || {}, result)));

    };
}
