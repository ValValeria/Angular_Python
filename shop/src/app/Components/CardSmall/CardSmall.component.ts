import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IAd } from '../../Interfaces/Interfaces';
import { ImageLoading } from '../../Classes/ImageLoading';

@Component({
    selector:"card",
    templateUrl:"./CardSmall.component.html"
})
export class CardSmall extends ImageLoading{
    @Input("card") card:IAd;
    readonly url:string = "http://127.0.0.1:8000"
    @ViewChild("img",{read:ElementRef}) public image:ElementRef;
}