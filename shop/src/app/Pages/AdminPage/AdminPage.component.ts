import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet } from 'ng2-charts';
import { $CHOOSE_ITEM, $DELETE_ITEMS, $ORDER_COUNT, OrderList } from 'src/app/Components/OrderList/OrderList.component';
import {remove, uniq} from 'lodash';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { from, interval, range } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';
import { ImageLoading } from 'src/app/Classes/ImageLoading';
import {pull} from 'lodash';
import { ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    @ViewChild('orders_active',{read:OrderList}) ordersArea: OrderList;
    message = "";
    errors: string[] = [];

    constructor(private http: Http, 
                public user: User,
                public router: Router,
                private _snackBar: MatSnackBar){
        super();
    }

    ngAfterViewInit(): void {
        window.onload = () => {
           document.querySelector("header").classList.add("bg-dark");
        };

        interval(1000)
        .pipe(
            take(5)
        ).subscribe((v) => {
            if (!this.user.is_auth){
                this.router.navigateByUrl("/authenticate");
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
                this.selectedItems.push(v);
            } else{
                pull(this.selectedItems, v);
                this.selectedCount -= 1;
            }
        });
    }

    delete_orders(): void{
        this.message = "";
        this.errors = [];

        let result = "";

        this.selectedItems.forEach(v => {
            result += `product_id=${v}&`;
        });

        result = result.slice(0, -1);

        this.http.get<{ status: string }>(`http://127.0.0.1:8000/api/deleteorder?${result}`)
        .subscribe(
        v => {
            this._snackBar.open("Товары удалены", "Закрыть", {
                duration: 10000
            });
            $DELETE_ITEMS.next(this.selectedItems);
            this.orderCount -= 1;
        },
        e => {
            this._snackBar.open("Произошла ошибка. Перезагрузите страницу", "Закрыть", {
                duration: 10000
            });
        })
    }

    change_orders(): void{
        let status: boolean = false;
        this.message = "";
        this.errors = [];

        from(this.selectedItems)
        .pipe(
           mergeMap(v=>{
               return this.http.get<{ "messages": string[], "data": string[], "status": string }>(`http://127.0.0.1:8000/api/addorder/?product_id=${v}&count=${this.ordersArea.productsCount[v]}`)
           }),
        )
        .subscribe(
        (v) => {
           this.message = "Отправляем запрос";

           if (v.status === "ok"){
               status = true;
           } else{
               status = false;
               this.errors.push(...v.messages);
           }
        },
        (e) => {
           this._snackBar.open("Что-то пошло не так. Пожалуйста, перезагрузите страницу","Закрыть",{
               duration: 2000
           });
           this.message = ""
           console.log(e)
        },
        () => {
           if (status){
               this._snackBar.open("Ваша корзина изменена", "Закрыть", {
                   duration: 10000
               });
           }
           this.message = ""
        });
    }
}

