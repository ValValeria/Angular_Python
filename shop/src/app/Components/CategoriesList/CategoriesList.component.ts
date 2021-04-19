import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-categories-list',
  templateUrl: './CategoriesList.component.html',
  styleUrls: ['./CategoriesList.component.scss']
})
export class CategoriesListComponent{
  @Input() activeCategory: string;
  @Input() activeBrand: string;
  @Input() priceStr: string;

  get data(): any{
    return [this.activeCategory, this.activeBrand, this.priceStr].filter(v => v).filter(v => v.length);
  }
}
