import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpService } from 'src/app/Services/Http.service';
import { UserService } from 'src/app/Services/User.service';
import {$DELETE_ITEMS, $ORDER_COUNT} from '../OrderList/OrderList.component';
import { $CLOSE_SEARCH, SearchForm } from '../SearchForm/SearchForm.component';
import {Subject} from 'rxjs/internal/Subject';

export const MEDIA$ = new Subject<boolean>();

@Component({
    selector: 'app-header-main',
    templateUrl: './Header.component.html',
    styleUrls: ['./Header.component.scss'],
    animations: [
        trigger('fade', [
            transition('enter=>leave', [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1 }))
            ]),
            transition('leave=>enter', [
                animate('1s', style({ opacity: 0 }))
            ]),
        ])
    ],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements AfterViewInit {
    @ViewChild('headerlinks', { read: ElementRef }) links: ElementRef;
    counter = 0;
    showPopup = false;
    readonly MAX_WIDTH = 1100;
    media = false;
    animState: 'enter' | 'leave' = 'enter';
    isSearchClicked = false;

    constructor(public user: UserService,
                private router: Router,
                private http: HttpService,
                private dialog: MatDialog) { }

    ngAfterViewInit(): void {
        let toggleClass = () => {
            if (window.matchMedia(`(max-width:${this.MAX_WIDTH})`).matches) {
                this.media = true;
                this.links.nativeElement.style.display = 'none';
            } else {
                this.media = false;
            }
        };

        toggleClass = toggleClass.bind(this);

        setTimeout(toggleClass, 0);

        window.onresize = toggleClass;

        $ORDER_COUNT.subscribe(v => {
            if (this.user.id === v[1].id){
              this.counter = v[0];
            }
        });

        $DELETE_ITEMS.subscribe((v) => {
            if (v[1].id === this.user.id){
              this.counter -= v[0].length;
            }
        });

        $CLOSE_SEARCH.subscribe(v => {
            this.dialog.closeAll();
        });

        this.dialog.afterAllClosed.subscribe(v => {
            this.isSearchClicked = false;
            document.body.classList.remove('overflow-y-hidden');
        });

        fromEvent(this.links.nativeElement, 'click')
        .pipe(filter((event: MouseEvent) => {
            const target: HTMLElement = event.target as HTMLElement;
            const cssLinksClass: string = (this.links.nativeElement as HTMLElement).classList.item(0);

            if (target.closest(`.${cssLinksClass}`)){
                return true;
            }

            return false;
        }))
        .subscribe(() => this.toggleHeader());
    }

    toggleHeader(): void {
        const elem: HTMLUListElement = this.links.nativeElement;

        setTimeout(() => {
            const display = elem.style.display || getComputedStyle(elem).display;

            if (display === 'none') {
                this.animState = 'leave';
            } else {
                this.animState = 'enter';
            }
        }, 0);
    }

    endAnimation($event: AnimationEvent): void {
        if ($event.fromState === 'leave') {
            this.links.nativeElement.style.display = 'none ';
        }
    }

    startAnimation($event: AnimationEvent): void {
        if ($event.fromState === 'enter') {
            this.links.nativeElement.style.display = 'flex ';
        }
    }

    showSearch(): void {
        if (!this.isSearchClicked){
          this.dialog.open(SearchForm, {
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw'
          });

          this.isSearchClicked = true;
          document.body.classList.add('overflow-y-hidden');
        }
    }

    get styles(): any{
        return {top: 0};
    }
}
