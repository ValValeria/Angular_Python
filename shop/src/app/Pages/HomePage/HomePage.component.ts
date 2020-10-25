import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';
import {isEqual} from 'lodash'

@Component({
    selector:"home",
    templateUrl:"./HomePage.component.html"
})
export class HomePage{
    ads:IAd[]=[];
    @ViewChildren("img",{read:ElementRef}) images:QueryList<ElementRef>

    constructor(private http:Http){}

    ngOnInit():void{
        this.http.get<IAd[]>("http://127.0.0.1:8000/api/products").subscribe(v=>{
            if((v||[]).length){
                this.ads=v;
            }
        });
    }

    errorImage($event:Event):void{
        const img:HTMLImageElement = $event.target as any;

        this.images.forEach(v=>{
              const mainElem = v.nativeElement;
              if(isEqual(mainElem,img)){
                   let prevSibling:HTMLElement = mainElem.previousElementSibling;
                   prevSibling.hidden = false;
                   mainElem.hidden = true;
              }
        })
    }
}