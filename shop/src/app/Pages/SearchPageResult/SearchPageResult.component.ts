import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-search-page',
    templateUrl: './SearchPageResult.component.html',
    styleUrls: ['./SearchPageResult.component.scss']
})
export class SearchPageResult{
    searchText = '';

    constructor(private route: ActivatedRoute,private router: Router){
        this.route.queryParamMap.subscribe(v => {
            this.searchText = v.get('search');
            if(this.searchText.length < 2){
                this.router.navigateByUrl('/products');
            }
        });
    }
}