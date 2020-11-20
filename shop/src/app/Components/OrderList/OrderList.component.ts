import { Component, OnInit } from '@angular/core';
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
export class OrderList implements OnInit{
    activeOrders: IAd[];
    constructor(private http: Http, private user: User){}

    ngOnInit(): void{
        this.http.get<{data: IAd[]}>('http://127.0.0.1:8000/api/get-orders/')
        .subscribe(v => {
            console.log(v);
            $ORDER_COUNT.next(v.data.length)
        });
    }
}