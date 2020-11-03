import { Injectable } from "@angular/core";
import { ViewChildren, ElementRef, QueryList } from "@angular/core";
import {isEqual} from 'lodash';

@Injectable()
export abstract class ImageLoading{
    @ViewChildren("img",{read:ElementRef}) protected images:QueryList<ElementRef>;

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