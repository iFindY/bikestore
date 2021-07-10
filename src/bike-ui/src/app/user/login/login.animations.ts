import {
  animate,
  animateChild, group,
  keyframes,
  query,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";


/** == == == == animations
 *
 * every trigger should know their state.
 * if it is a nested trigger, doest meter have to redefine them
 */
export const loginRegister = trigger('login-register', [
  transition('login <=> register, registered => login', [
    group([
      query('@move', animateChild()),
      query('@moveText', animateChild()),
      query('@registered', animateChild())])])]);


export const move = trigger('move', [
  state('login, reset',         style({ height: '149px' })),
  state('register, registered', style({ height: '229px', transform: 'translateY(0)' })),

  transition('login <=> register, registered => login', animate('300ms ease-out')),
  transition('register => registered',[
    query('@registered', animateChild())]),

]);

export const moveText = trigger('moveText', [
  state('login',                 style({ 'margin-top': '5px' })),
  state('register, registered',   style({  'margin-top': '33px' })),

  transition('login <=> register', animate('300ms ease-out'))]);


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


