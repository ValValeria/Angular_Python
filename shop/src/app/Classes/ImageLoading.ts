import { Injectable } from "@angular/core";
import {  ElementRef } from "@angular/core";

@Injectable()
export abstract class ImageLoading{
    public  image:ElementRef;

    errorImage($event:Event):void{
        const mainElem = this.image.nativeElement;
        let prevSibling:HTMLElement = mainElem.previousElementSibling;
        prevSibling.hidden = false;
        mainElem.hidden = true;
    }
}