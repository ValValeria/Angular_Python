import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet } from 'ng2-charts';
import { $CHOOSE_ITEM, $ORDER_COUNT } from 'src/app/Components/OrderList/OrderList.component';
import {uniq} from 'lodash'
import { IAd } from 'src/app/Interfaces/Interfaces';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { ImageLoading } from 'src/app/Classes/ImageLoading';


@Component({
    selector: 'app-admin',
    templateUrl: './AdminPage.component.html',
    styleUrls: ['./AdminPage.component.scss']
})
export class AdminPage extends ImageLoading implements AfterViewInit, AfterContentInit{
    orderCount = 0;
    doughnutChartType: ChartType = 'doughnut';
    public doughnutChartLabels: string[] = [];
    public doughnutChartData: MultiDataSet;
    public selectedCount = 0;
    public selectedItems: number[] = [];

    constructor(private http: Http, public user: User, public router: Router){
        super();
    }

    ngAfterViewInit(): void {
        window.onload = () => {
           document.querySelector("header").classList.add("bg-dark");
        };

        interval(1000)
        .pipe(
            take(3)
        ).subscribe((v) => {
            if (!this.user.is_auth){
                this.router.navigateByUrl("/");
            }
        })

        $ORDER_COUNT.subscribe(elem => {
            setTimeout(() => {
                this.orderCount = elem;

                this.doughnutChartLabels = uniq(this.user.activeOrders.map(v => v.brand));

                const numbers: number[] = [];

                this.doughnutChartLabels.forEach(item => {
                    const sortByCat: IAd[] = this.user.activeOrders.filter(v => v.brand === item);
                    let num = sortByCat.reduce((prev, current) => prev + current.count, 0);
                    console.log(num);
                    num = Math.round((num * 100) / this.orderCount);
                    numbers.push(num);
                });

                this.doughnutChartData = [numbers];
                console.log(this.doughnutChartData[0]);
            }, 0);
        });
    } 

    ngAfterContentInit(): void{
        this.http.get<{ data: { active: IAd[], unactive: IAd[] }, amount_of_orders: number, amount_of_products: number }>('http://127.0.0.1:8000/api/get-orders/')
                .subscribe(v => {
                    this.user.addActiveProducts(v.data.active);
                    this.user.addUnactiveProducts(v.data.unactive);
                });

        $CHOOSE_ITEM.subscribe(v => {
            if (!this.selectedItems.includes(v)){
                this.selectedCount += 1;
            }
        })
    }
}

