import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'splitspace'})
export class SplitSpace implements PipeTransform {
  transform(list: string[]): string {
    const postfix = list.length > 5 ? ' ...' : '';
    return  list.slice(0,5).toString().replace(/,/gi, ', ').substr(0, 57)+postfix;
  }
}
