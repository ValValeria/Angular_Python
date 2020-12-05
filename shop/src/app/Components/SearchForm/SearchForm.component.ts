import { AfterViewInit, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { auditTime, filter, mergeMap, tap } from 'rxjs/operators';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';

export const $CLOSE_SEARCH = new Subject<number>();

@Component({
    selector: 'app-search',
    templateUrl: './SearchForm.component.html',
    styleUrls: ['./SearchForm.component.scss']
})
export class SearchForm implements AfterViewInit{
    @ViewChild("search", {read: ElementRef}) searchElem: ElementRef;
    results: IAd[] = [];
    message = '';

    constructor(private http: Http){}

    ngAfterViewInit(): void {
        const elem: HTMLInputElement = this.searchElem.nativeElement;
        fromEvent(elem, 'input')
        .pipe(
            auditTime(400),
            tap(v => {
                this.message = ``;
            }),
            filter(v => elem.value.length > 2 && elem.value.length < 10),
            mergeMap(() => {
                return this.http.get<{ data: { results: IAd[] } }>
                                   ('http://127.0.0.1:8000/api/search/?search=' 
                                    + encodeURIComponent(elem.value));
            })
        )
        .subscribe(v => {
            this.results = v.data.results;

            if (this.results.length === 0){
               this.message = 'Нет результатов';
            }
        });
    }

    close(): void{
        $CLOSE_SEARCH.next(0);
    }
}