import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: any, limit = 15, end = '...', args?: any): any {
    let shortEndValue = '';

    if (value) {
      let words = value.split(/\s+/);
      if (words.length > limit) {
        shortEndValue = words.slice(0, limit).join(' ') + end;
      } else {
        shortEndValue = value;
      }
    }


    return shortEndValue;
  }

}
