import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-category-page',
    templateUrl: './CategoryPage.component.html',
    styleUrls: ['./CategoryPage.component.scss']
})
export class CategoryPage{
    category = '';
    urls: string[];

    constructor(private router: ActivatedRoute){
        router.paramMap.subscribe(v => {
           this.category = v.get("category");
        });
        this.urls = ['/assets/cat.jpg', '/assets/cat2.jpg'];
    }
}