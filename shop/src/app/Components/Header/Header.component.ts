import { AfterViewInit, ViewContainerRef } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router} from '@angular/router';
import { User } from 'src/app/Services/User.service';
import { $ORDER_COUNT } from '../OrderList/OrderList.component';

@Component({
    selector:"header-main",
    templateUrl:"./Header.component.html",
    styleUrls:["./Header.component.scss"]
})
export class Header implements AfterViewInit{
    @ViewChild('headerlinks',{read:ElementRef}) links:ElementRef;
    counter: number = 0;
    
    constructor(public user:User, private router: Router, private header:ViewContainerRef){}

    ngAfterViewInit(): void {
        const elem: HTMLUListElement = this.links.nativeElement;

        const toggleClass = () => {
                if (window.innerWidth > 770) {
                    elem.classList.remove('none');
                } else {
                    elem.classList.add('none');
                }
        };

        window.onresize = toggleClass;

        $ORDER_COUNT.subscribe(v=>{
            this.counter = v;
        })
    }

    toggleHeader():void{
        const elem:HTMLUListElement = this.links.nativeElement;
        setTimeout(()=>this.headerClass(elem),0);
    }

    headerClass(elem:HTMLUListElement):void{  
        
        if(elem.classList.contains("none")){
            elem.closest('header').classList.add("header__media");
        } else{
            elem.closest('header').classList.remove("header__media");
        }

        elem.classList.toggle("none");
    }

    logout(): void{
        localStorage.removeItem("auth");
        this.user.logout();
        this.router.navigateByUrl("/");
    } 
}