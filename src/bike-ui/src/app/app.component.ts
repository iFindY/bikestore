import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {UserState} from "./state/user/user.reducers";
import {userStatus} from "./state/user/user.actions";
import {LayoutService} from "./services/layout.service";
import {Subscription} from "rxjs";
import {Sizes} from "./services/models/layout.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent{
  private subscription: Subscription;
  private fontSize;
  title = 'Arkadi\'s canto';

  events: string[] = ['Team', 'Events', 'Blog'];
  contacts: string[] = ['Pricing', 'Contact'];
  lessons: string[] = ['Guitar', 'Trumpet', 'Violin', 'Singing', 'Piano', 'Drum'];

  constructor(private store$: Store<UserState>, private layoutService:LayoutService) {
    this.store$.dispatch(userStatus());
     this.subscription = layoutService.getWindowSize().subscribe(s => this.setFontSize(s));
    this.fontSize =  document.body.parentElement.style.fontSize

  };

  private setFontSize(s: Sizes) {
    console.log(s)
    switch (s) {
      case "Large" : document.body.parentElement.style.fontSize = '14px'; break;
      case "XLarge": document.body.parentElement.style.fontSize = '16px'; break;
      case "Medium": document.body.parentElement.style.fontSize = '10px'; break;
      case "XSmall": document.body.parentElement.style.fontSize = '8px'; break;
    }
  }
}
