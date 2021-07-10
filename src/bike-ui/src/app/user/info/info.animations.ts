import {animate, state, style, transition, trigger} from "@angular/animations";


export const hide = trigger('hide', [
  state('logout',style({opacity:"100%",})),
  state('login',  style({opacity:"0%",})),
  transition('logout => login',
      animate('600ms {{delay}}ms ease-out'),{ params: { delay: 1100 } })]);

