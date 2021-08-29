import {Component, OnDestroy} from '@angular/core';
import {LayoutService} from "../services/layout.service";
import {Subscription} from "rxjs";
import {Sizes} from "../services/models/layout.model";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnDestroy {


  windowSize: Sizes = 'XLarge';
  subscriptions: Subscription;
  public value: string = '';

  constructor(public screenSizeService: LayoutService) {
    this.subscriptions = this.screenSizeService.getWindowSize()
    .subscribe(size => this.windowSize = size);

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }


}
