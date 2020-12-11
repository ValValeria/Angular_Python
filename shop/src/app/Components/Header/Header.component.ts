import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ViewContainerRef } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router} from '@angular/router';
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
            transition(":enter",[
                style({opacity:0}),
                animate("1s",style({opacity:1}))
            ]),
            transition(":leave", [
                animate("1s", style({ opacity: 0}))
            ]),
        ])
    ]
})
export class Header implements AfterViewInit{
    @ViewChild('headerlinks',{read:ElementRef}) links:ElementRef;
    counter: number = 0;
    showPopup = false;
    mediaAvatar = false;
    
    constructor(public user:User,
                private router: Router,
                private http: Http,
                private dialog: MatDialog){}

    ngAfterViewInit(): void {
        const elem: HTMLUListElement = this.links.nativeElement;

        const toggleClass = () => {
                if (document.documentElement.clientWidth > 1000) {
                    elem.classList.remove('none');
                    setTimeout(()=>{
                        this.mediaAvatar = false;
                    },0)
                } else {
                    elem.classList.add('none');
                    setTimeout(() => {
                        this.mediaAvatar = true;
                    }, 0)
                }
        };

        toggleClass();

        window.onresize = toggleClass;

        $ORDER_COUNT.subscribe(v=>{
            this.counter = v;
        })

        $CLOSE_SEARCH.subscribe(v => {
            this.dialog.closeAll();
        })
    }

    toggleHeader():void{
        const elem:HTMLUListElement = this.links.nativeElement;
        setTimeout(()=>this.headerClass(elem),0);
    }

    headerClass(elem:HTMLUListElement):void{  
        elem.classList.toggle("none");
    }

    logout(): void{
        localStorage.removeItem("auth");
        this.user.logout();
        this.router.navigateByUrl("/");
    } 

    deleteProfile(): void{
        this.http.get("http://127.0.0.1:8000/api/delete-user").subscribe(()=>{
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