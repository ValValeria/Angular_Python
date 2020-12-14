import { animate, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { AfterViewInit, ViewContainerRef } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';
import { URL_PATH } from 'src/app/app.component';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';
import { $ORDER_COUNT } from '../OrderList/OrderList.component';
import { $CLOSE_SEARCH, SearchForm } from '../SearchForm/SearchForm.component';

@Component({
    selector:"header-main",
    templateUrl:"./Header.component.html",
    styleUrls:["./Header.component.scss"],
    animations:[
        trigger("fade",[
            transition("enter=>leave",[
                style({opacity:0}),
                animate("1s",style({opacity:1}))
            ]),
            transition("leave=>enter", [
                animate("1s", style({ opacity: 0}))
            ]),
        ])
    ]
})
export class Header implements AfterViewInit{
    @ViewChild('headerlinks', {read:ElementRef}) links:ElementRef;
    counter = 0;
    showPopup = false;
    mediaAvatar = false;
    animState: 'enter' | 'leave' = 'enter';
    
    constructor(public user:User,
                private router: Router,
                private http: Http,
                private dialog: MatDialog){}

    ngAfterViewInit(): void {
        let toggleClass = () => {
            if (window.matchMedia('(max-width:1108px)').matches) {
                this.mediaAvatar = true;
                this.links.nativeElement.style.display = 'none';
            } else {
                this.mediaAvatar = false;
                this.links.nativeElement.style.display = 'flex';
            }   
        };

        toggleClass = toggleClass.bind(this);

        setTimeout(toggleClass, 0);

        window.onresize = toggleClass;

        $ORDER_COUNT.subscribe(v=>{
            this.counter = v;
        })

        $CLOSE_SEARCH.subscribe(v => {
            this.dialog.closeAll();
        })
    }

    toggleHeader(): void{
        const elem: HTMLUListElement = this.links.nativeElement;
        setTimeout(() => {
            const display = elem.style.display;
            const display_css = getComputedStyle(elem).display;

            if (display === 'none' || display_css === 'none'){
                elem.style.display = 'block';
                this.animState = 'leave';
            } else{
                this.animState = 'enter';
            }
        }, 0);
    }

    endAnimation($event: AnimationEvent): void{
        if ($event.fromState === "leave"){
            this.links.nativeElement.style.display = 'none ';
        }
    }

    logout(): void{
        localStorage.removeItem("auth");
        this.user.logout();
        this.router.navigateByUrl("/");
    } 

    deleteProfile(): void{
        this.http.get(`${URL_PATH}api/delete-user`).subscribe(()=>{
            this.logout();
        });
    }

    showSearch(): void{
        this.dialog.open(SearchForm,{
            width:"80vw",
            height:"70vh"
        });
    }
}