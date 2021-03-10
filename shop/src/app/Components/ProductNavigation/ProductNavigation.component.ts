import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

function getYCoordinates(elem): number{
    const domElem = document.querySelector(elem[1]);
    const y = pageYOffset + domElem.getBoundingClientRect().top;

    return y;
}

@Component({
    selector: 'app-product-navigation',
    templateUrl: './ProductNavigation.component.html',
    styleUrls: ['./ProductNavigation.component.scss']
})
export class ProductNavigation implements AfterViewInit{
    @ViewChild("stepper", { read: MatHorizontalStepper }) stepper: MatHorizontalStepper;
    readonly data;
    
    constructor(){
        this.data = [["Общее",'#images'],
                     ["Описание",'#info'],
                     ["Комментарии",'#comments'], 
                     ["Похожие товары","#ads"]];
    }

    ngAfterViewInit(): void{
        this.stepper.selectionChange.subscribe(v=>{
            const elem = this.data[v];

            if(!elem) return false;

            const y = getYCoordinates(elem);

            interval(40)
            .pipe(
                takeWhile(v=>{
                    let centerX = document.documentElement.clientWidth / 2;
                    let centerY = document.documentElement.clientHeight / 2;
                    const destElem = document.querySelector(elem[1]);
                    const elemFromPoint: HTMLElement = document.elementFromPoint(centerX,centerY) as HTMLElement | null;

                    if(elemFromPoint.closest(elem[1]) || elemFromPoint.contains(destElem)){
                        return false;
                    }

                    return true;
                })
            ).subscribe(v=>{
                window.scrollBy(0,40)
            })
        })    
    }
}