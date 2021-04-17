import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { fromEvent, interval } from 'rxjs';
import { auditTime, skipWhile, take, takeWhile } from 'rxjs/operators';


@Component({
    selector: 'app-product-navigation',
    templateUrl: './ProductNavigation.component.html',
    styleUrls: ['./ProductNavigation.component.scss']
})
export class ProductNavigation implements OnInit{
    @ViewChild("stepper", { read: MatHorizontalStepper }) stepper: MatHorizontalStepper;
    readonly INTENSITY = 40;
    readonly data;
    isClicked: boolean;
    
    constructor(){
        this.data = [["Общее",'#images'],
                     ["Описание",'#info'],
                     ["Комментарии",'#comments'], 
                     ["Похожие товары","#ads"]];
    }

    ngOnInit(): void{
        fromEvent(window,"scroll")
        .subscribe(_event=>{
            if(!this.isClicked){
                const elemFromPoint = this.elemFromPoint;

                this.data.map(([_v1, v2]) => v2).forEach((element, index) => {
                    if (elemFromPoint.closest(element)) {
                    }
                });
            }
        })
    }

    click(): void{
        const elem = this.data[this.stepper.selectedIndex];
        this.isClicked = true;

        interval(this.INTENSITY)
            .pipe(
                takeWhile(v => {
                    const elemFromPoint = this.elemFromPoint;

                    if (elemFromPoint.closest(elem[1])) {
                        return false;
                    }

                    return true;
                })
            ).subscribe(v => {
                this.isClicked = true;
                window.scrollBy(0, this.INTENSITY)
            }, null, () => this.isClicked = false)
             
    }

    get elemFromPoint(): null | HTMLElement{
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        const elemFromPoint = document.elementFromPoint(clientWidth / 2, clientHeight / 2) as HTMLElement;
        
        return elemFromPoint;
    }
}