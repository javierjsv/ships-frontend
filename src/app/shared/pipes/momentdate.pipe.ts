import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";
// import 'moment/locale/en-au';

@Pipe({
  name: 'momentdate'
})
export class MomentdatePipe implements PipeTransform {

  transform(date: any, format = 'LL'): any {
    const newDate = moment(date).format(format);
    return newDate;
  }

}
