import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector:"header-main",
    templateUrl:"./Header.component.html",
})
export class Header implements AfterViewInit{
    @ViewChild('headerlinks',{read:ElementRef}) links:ElementRef;

    ngAfterViewInit(): void {
        this.toggleHeader();
    }

    toggleHeader():void{
        const elem:HTMLUListElement = this.links.nativeElement;
        
        this.headerClass(elem)

        window.onresize  = ()=>{
             if(window.innerWidth>770){
                 elem.classList.remove('none')
             } else{
                 elem.classList.add('none')   
             }
        }
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