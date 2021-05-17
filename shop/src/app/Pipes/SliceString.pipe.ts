import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'sliceString'})
export class SliceStringPipe implements PipeTransform{

  transform(value: string, maxWordCount: number): string {
    const words = value.split(' ');
    return words.slice(0, maxWordCount).join(' ');
  }
}
