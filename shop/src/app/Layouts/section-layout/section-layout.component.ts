import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-section-layout',
  templateUrl: './section-layout.component.html',
  styleUrls: ['./section-layout.component.scss']
})
export class SectionLayoutComponent{
  @Input() title: string;
  @Input() cssClass: string;
  @Input() hasTitle = true;

  constructor() { }

  getCssClass(block: string, ...classes: string[]): string[]{
    return [`section__${block}`, `${this.cssClass}__${block}`, ... classes];
  }
}
