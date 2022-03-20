import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clockify'
})
export class ClockifyPipe implements PipeTransform {

  private readonly zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

  transform(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${this.zeroPad(minutes, 2)}:${this.zeroPad(seconds, 2)}`;
  }

}
