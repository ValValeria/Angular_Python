import { Component, Input, OnInit } from '@angular/core';
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
    displayedColumns: string[];
    @Input() data: IAd[];
    @Input() showCount = true;
    constructor(private http: Http, private user: User){}

    ngOnInit(): void{
        if (this.data){
          this.activeOrders = this.data;
        } else{
            this.http.get<{ data: { active: IAd[], unactive: IAd[] }, amount_of_orders: number, amount_of_products: number }>('http://127.0.0.1:8000/api/get-orders/')
                .subscribe(v => {
                    this.activeOrders = v.data.active;
                    this.displayedColumns = ["id", "title", "price", "count"];
                    this.user.addActiveProducts(this.activeOrders);
                    this.user.addUnactiveProducts(v.data.unactive);
                    $ORDER_COUNT.next(v.amount_of_orders);
                });
        }
    }
}
