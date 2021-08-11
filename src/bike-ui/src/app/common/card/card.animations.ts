import {animate, state, style, transition, trigger} from '@angular/animations';

export const bodyExpansion = trigger('bodyExpansion', [
  state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
  state('expanded', style({ height: '*', visibility: 'visible' })),

  transition('expanded <=> collapsed, void => collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);


export const rotate = trigger('rotate', [
  state('collapsed, void', style({transform: 'rotate(0deg)', 'transform-origin': '70% 70%'})),
  state('expanded', style({transform: 'rotate(180deg)', 'transform-origin': '70% 70%'})),

  transition('expanded <=> collapsed, void => collapsed',
      animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
]);
