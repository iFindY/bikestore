import {Breakpoints} from "@angular/cdk/layout";


/**
 * Handset
 * Tablet
 * Web
 * HandsetPortrait
 * TabletPortrait
 * WebPortrait
 * HandsetLandscape
 * TabletLandscape
 * WebLandscape
 */


export type Sizes = 'XSmall' | 'Small' | 'Medium' | 'Large' | 'XLarge' | 'Web' | 'TabletLandscape';

export const watchers = [
  Breakpoints.XSmall,
  Breakpoints.Small,
  Breakpoints.Medium,
  Breakpoints.Large,
  Breakpoints.XLarge];

