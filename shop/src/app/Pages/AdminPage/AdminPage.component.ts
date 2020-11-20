import { Component, OnInit } from '@angular/core';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';
import { Router } from '@angular/router';
import { $ORDER_COUNT } from 'src/app/Components/OrderList/OrderList.component';


@Component({
    selector: 'app-admin',
    templateUrl: './AdminPage.component.html',
    styleUrls: ['./AdminPage.component.scss']
})
export class AdminPage implements OnInit{
    orderCount = 0;

    constructor(private http: Http, public user: User, public router: Router){}

    ngOnInit(): void{
         $ORDER_COUNT.subscribe(v => {
             this.orderCount = v || 0;
         });
    }
}
