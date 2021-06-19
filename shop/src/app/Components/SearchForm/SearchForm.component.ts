import { AfterViewInit, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { auditTime, filter, mergeMap, tap } from 'rxjs/operators';
import { URL_PATH } from 'src/app/app.component';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { HttpService } from 'src/app/Services/Http.service';

export const $CLOSE_SEARCH = new Subject<number>();

@Component({
    selector: 'app-search',
    templateUrl: './SearchForm.component.html',
    styleUrls: ['./SearchForm.component.scss']
})
export class SearchForm{
    @ViewChild('search', {read: ElementRef}) searchElem: ElementRef;
    results: IAd[] = [];
    message = '';
    hasMore: boolean;
    searchText = '';

    constructor(private http: HttpService, private diaglog: MatDialog){}

    click(): void {
        const elem: HTMLInputElement = this.searchElem.nativeElement;

        this.searchText = encodeURIComponent(elem.value);

        this.message = ``;

        this.http.get<{ data: { results: IAd[] } }>
            (`${URL_PATH}api/search/?search=`
                + encodeURIComponent(elem.value))
        .subscribe(v => {
            this.results = v.data.results.slice(0, 10);

            if(v.data.results.length > 10){
                this.hasMore = true;
            }

            if (this.results.length === 0){
               this.message = 'Нет результатов';
            }
        });
    }

    close(): void{
        $CLOSE_SEARCH.next(0);
    }

    showMore(): void{
        this.diaglog.closeAll();
    }
}
