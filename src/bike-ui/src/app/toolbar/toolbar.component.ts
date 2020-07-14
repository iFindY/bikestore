import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {MatDialog} from '@angular/material/dialog';
import { LoginToolBarComponent } from './login/login-tool-bar.component';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('moveUp', [
      state('out',style({opacity: 0})),
      state('in', style({opacity: 1})),
      transition('*=>in', [
            style({opacity: 0}),
            animate(600 )]),
      transition('*=>out',
          animate(600, style({opacity: 0})))

        ]
    )
  ]
})
export class ToolbarComponent  {

  // just for testing
  clicked: string = 'out';

  constructor(public dialog: MatDialog) {};


  showLoginDialog() {
    this.dialog.open(LoginToolBarComponent);
  }


  //====just for animation testing
  setClickedIn() {
    this.clicked = this.clicked === 'in' ? 'out' : 'in';
    console.log(this.clicked)
  }
}
