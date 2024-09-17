import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardMask'
})
export class CardMaskPipePipe implements PipeTransform {

  transform(value: string): string {
    const visibleDigits = 8; // Number of visible digits at the end
    if (value.length <= visibleDigits) {
      return value; // No need to mask if the length is less than or equal to visibleDigits
    }

    const maskedValue = '*'.repeat(value.length - visibleDigits) + value.slice(-visibleDigits);
    return maskedValue;
  }

}
