import {Injectable, OnDestroy} from '@angular/core';
import {filter, map, shareReplay, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {User} from '../user/user.model';
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Sizes, watchers} from "./models/layout.model";


/**
 * XSmall  (max-width: 599.98px)
 * Small  (min-width: 600px) and (max-width: 959.98px)
 * Medium  (min-width: 960px) and (max-width: 1279.98px)
 * Large  (min-width: 1280px) and (max-width: 1919.98px)
 * XLarge  (min-width: 1920px)
 * Handset  (max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)
 * Tablet  (min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)
 * Web  (min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)
 * HandsetPortrait  (max-width: 599.98px) and (orientation: portrait)
 * TabletPortrait  (min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)
 * WebPortrait  (min-width: 840px) and (orientation: portrait)
 * HandsetLandscape  (max-width: 959.98px) and (orientation: landscape)
 * TabletLandscape  (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)
 * WebLandscape  (min-width: 1280px) and (orientation: landscape)
 */

@Injectable({providedIn: 'root'})
export class LayoutService implements OnDestroy {

  private windowSize: BehaviorSubject<Sizes> = new BehaviorSubject('Large');

  private subscriptions: Subscription;

  constructor(private breakpointObserver: BreakpointObserver) {

    this.subscriptions = this.breakpointObserver.observe(watchers)
    .subscribe((state: BreakpointState) => {
      if (state.breakpoints[Breakpoints.XSmall]) {
        this.windowSize.next('XSmall');
      } else if (state.breakpoints[Breakpoints.Small]) {
        this.windowSize.next('Small');
      } else if (state.breakpoints[Breakpoints.Medium]) {
        this.windowSize.next('Medium');
      } else if (state.breakpoints[Breakpoints.Large]) {
        this.windowSize.next('Large');
      } else if (state.breakpoints[Breakpoints.XLarge]) {
        this.windowSize.next('XLarge');
      } else if (state.breakpoints[Breakpoints.Web]) {
        this.windowSize.next('Web');
      } else if (state.breakpoints[Breakpoints.TabletLandscape]) {
        this.windowSize.next('TabletLandscape');
      }
    });
  }

  getWindowSize(): Observable<Sizes> {
    return this.windowSize.asObservable();
  }

  isPhoneSize(): Observable<boolean> {
    return this.windowSize.asObservable()
    .pipe(map(s => s === 'XSmall'));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}

