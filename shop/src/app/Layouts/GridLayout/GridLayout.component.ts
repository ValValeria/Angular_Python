import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-grid-layout',
  templateUrl: './GridLayout.component.html',
  styleUrls: ['./GridLayout.component.scss']
})
export class GridLayoutComponent{
  @Input() min = '250px';
  @Input() max = '1fr';
  styles: object;

  constructor() {
    this.styles = {
      gridTemplateColumns: `repeat(auto-fit, minmax(${this.min},${this.max}))`
    };
  }
}
