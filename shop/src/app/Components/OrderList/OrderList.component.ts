import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { User } from 'src/app/Services/User.service';
import { Http } from '../../Services/Http.service';


export const $ORDER_COUNT = new Subject<number>();


@Component({
    selector: 'app-list',
    templateUrl: './OrderList.component.html',
    styleUrls: ['./OrderList.component.scss']
})
export class OrderList implements OnInit,OnChanges{
    displayedColumns: string[];
    @Input() data: IAd[];
    @Input() showCount = true;
    constructor(private http: Http, private user: User){}

    ngOnInit(): void{
        this.displayedColumns = ["id", "title", "price", "count"];
    }

    ngOnChanges(d: SimpleChanges): void {
        const data = d.data;

        if (data.isFirstChange() || !_.isEqual(data.previousValue, data.currentValue)){
            $ORDER_COUNT.next(this.data.length);
        }         
    }
}
