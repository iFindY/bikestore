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
  state('login',      style({ transform: 'translateX(0)' })),
  state('register',   style({ transform: 'translateX(0)' })),
  state('registered', style({ transform: 'translateX(0)' })),
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



  transition('* => login', [
    query('@hide', animateChild()),
    animate("600ms", keyframes([
      style({ transform: 'translateX(-33%)', offset: 0}),
      style({ transform: 'translateX(-0.3%)', offset: 0.2}),
      style({ transform: 'translateX(0%)',  offset: 1})]))]),
]);


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

export const hide = trigger('hide', [
  state('logout',style({opacity:"100%",})),
  state('login',  style({opacity:"0%",})),
  transition('logout => login', animate('600ms {{delay}}ms ease-out'),{ params: { delay: 1100 } })]);

