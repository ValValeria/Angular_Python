import { AfterViewInit, ViewContainerRef } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterEvent, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { User } from 'src/app/Services/User.service';

@Component({
    selector:"header-main",
    templateUrl:"./Header.component.html",
})
export class Header implements AfterViewInit{
    @ViewChild('headerlinks',{read:ElementRef}) links:ElementRef;
    
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

        this.router.events.pipe(filter(v => v instanceof RoutesRecognized)).subscribe((v:RouterEvent) => {
             const url = v.url;
             const header: HTMLElement = this.header.element.nativeElement.querySelector("header");
             toggleClass();

             if (url.includes("/profile")){
                 header.classList.add("bg-dark")
             } else{
                 header.classList.remove("bg-dark");
             }
        });
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
}