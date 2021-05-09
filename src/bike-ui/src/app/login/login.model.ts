import {
    animate,
    animateChild,
    group,
    keyframes,
    query, state,
    style,
    transition,
    trigger
} from "@angular/animations";

export type LoginScreen = 'login' | 'logged-in' | 'logout' | 'reset' | 'register' | 'registered' | 'code' | 'password' | 'done';



export interface User {
    name: string;
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
import {FormGroup, ValidatorFn} from "@angular/forms";

export function mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {

        const control = formGroup.controls[controlName],
            matchingControl = formGroup.controls[matchingControlName];

        // fierds must be enabled, skip validation
        if (control.disabled || matchingControl.disabled) return;

        // return if another validator has already found an error on the matchingControl
        if (matchingControl.errors && !matchingControl.errors.mustMatch) return;

        // set error on matchingControl if validation fails
        control.value !== matchingControl.value?
            matchingControl.setErrors({ mustMatch: true }):
            matchingControl.setErrors(null);
    }
}


export function conditionalValidator(activePane: LoginScreen, validators: ValidatorFn | ValidatorFn[]): ValidatorFn {
    return (control) => {

        if (activePane!=='register') return null;

        else if (!Array.isArray(validators)) return validators(control);

        else return validators
            .map(v => v(control))
            .reduce((errors, result) =>
                result === null ? errors : (Object.assign(errors || {}, result)));

    };
}



/** == == == == animations
 *
 * every trigger should know their state.
 * if it is a nested trigger, doest meter have to redefine them
 */
export const slide = trigger('slide', [
    state('login',      style({ transform: 'translateX(0)' })),
    state('register',   style({ transform: 'translateX(0)' })),
    state('registered',  style({ transform: 'translateX(0)' })),
    state('reset',      style({ transform: 'translateX(-33%)' })),
    state('code',       style({ transform: 'translateX(-33%)' })),
    state('password',   style({ transform: 'translateX(-33%)' })),
    state('done',       style({ transform: 'translateX(-33%)' })),
    state('logout',     style({ transform: 'translateX(-66%)' })),

    // order matter
    transition('login <=> register, registered => login',[
        group([
            query('@move', animateChild()),
            query('@moveText', animateChild()),
            query('@registered', animateChild())])]),

    transition('reset => code',[
        query('@moveResetDigits', animateChild())]),

    transition('* => reset', [
        animate("600ms", keyframes([
            style({ transform: 'translateX(0)', offset: 0}),
            style({ transform: 'translateX(-32.7%)', offset: 0.2}),
            style({ transform: 'translateX(-33%)',  offset: 1})]))]),

    transition('login <=> logout', [
        animate('600ms', keyframes([
            style({ opacity: '100%', transform: 'translateX(0)', offset: 0 }),
            style({ opacity: '0%', transform: 'translateX(-65.3%)', offset: 0.2 }),
            style({ opacity: '100%', transform: 'translateX(-66%)', offset: 1 })]))]),


    transition('* => login', [
        animate("600ms", keyframes([
            style({ transform: 'translateX(-33)', offset: 0}),
            style({ transform: 'translateX(-0.3%)', offset: 0.2}),
            style({ transform: 'translateX(0%)',  offset: 1})]))]),
]);

export const move = trigger('move', [
        state('login, reset',        style({ height: '149px' })),
        state('register, registered', style({ height: '229px', transform: 'translateY(0)' })),
        transition('login <=> register,registered => login', animate('300ms ease-out')),
        transition('register => registered',[
            query('@registered', animateChild())]),

    ]);

export const moveText = trigger('moveText', [
        state('login',                 style({ 'margin-top': '5px' })),
        state('register, registered',   style({  'margin-top': '33px' })),
        transition('login <=> register', animate('300ms ease-out'))]);

export const moveResetDigits = trigger('moveResetDigits', [
        state('reset, login',            style({ height: '80px' })),
        state('code, password, done',   style({ height: '149px' })),

        transition('reset => code',
            animate("400ms", keyframes([
                style({ height: '80px', offset: 0 }),
                style({ height: '140px', offset: 0.3 }),
                style({ height: '149px', offset: 1 })]))),

        transition('code => password',[
            query('@showPassword', animateChild())]),

    ]);

export const registered = trigger('registered', [
        state('registered',  style({transform: 'translateY(-{{top}}%)' }), { params: {top:200 } }),
        state('login',      style({transform: 'translateY(0)' }), { params: {top:200 } }),

        transition('register => registered', [
            animate("1000ms", keyframes([
                style({ opacity:"100%",     transform: 'translateY(0)', offset: 0}),
                style({ opacity:"0",        transform: 'translateY(0)', offset: 0.3}),
                style({ opacity:"0",        transform: 'translateY(-{{top}}%)', offset: 0.35}),
                style({ opacity:"100%",     transform: 'translateY(-{{top}}%)', offset: 1})]))]),

        transition("registered => login", [
            animate("400ms", keyframes([
                style({ opacity:"100%",   transform: 'translateY(-{{top}}%)', offset: 0}),
                style({ opacity:"0%",    transform: 'translateY(-{{top}}%)', offset: 0.3}),
                style({ opacity:"0%",    transform: 'translateY(0)', offset: 0.7}),
                style({ opacity:"100%",   transform: 'translateY(0)', offset: 1})]))])
    ]);

export const showPassword = trigger('showPassword', [
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

    ]);

