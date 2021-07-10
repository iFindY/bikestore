import {
  animate,
  animateChild,
  group, keyframes,
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
export const slide = trigger('slide', [

  // initial state which will be extend through sub structure
  state('login, register, registered', style({transform: 'translateX(0)'})),
  state('reset, code, password, done', style({transform: 'translateX(-33%)'})),
  state('logout', style({transform: 'translateX(-66%)'})),

  // sliding left right
  transition('login => reset, register => reset', [
    animate("600ms", keyframes([
      style({transform: 'translateX(0)', offset: 0}),
      style({transform: 'translateX(-32.7%)', offset: 0.2}),
      style({transform: 'translateX(-33%)', offset: 1})]))]),

  transition('reset => login, code => login, password => login, done => login', [
    animate("600ms", keyframes([
      style({transform: 'translateX(-33%)', offset: 0}),
      style({transform: 'translateX(-0.3%)', offset: 0.2}),
      style({transform: 'translateX(0%)', offset: 1})]))]),

  transition('logout => login', [
    query('@hide', animateChild())])
]);
