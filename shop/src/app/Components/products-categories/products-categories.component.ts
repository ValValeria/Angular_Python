import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss']
})
export class ProductsCategoriesComponent implements AfterViewInit {
  @ViewChildren('article', {read: ElementRef}) articles: QueryList<ElementRef>;

  constructor(private snackBar: MatSnackBar) { }

  ngAfterViewInit(): void {
    this.articles.forEach(v => {
      const element = v.nativeElement as HTMLElement;

      element.addEventListener('click', ($event) => {
          $event.preventDefault();
          $event.stopPropagation();

          this.snackBar.open('Товары в данной категори ещё не существуют', 'close');
      });
    });
  }
}
