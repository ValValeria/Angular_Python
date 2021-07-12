import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { from, interval, Observable } from 'rxjs';
import { reduce, skipWhile, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { URL_PATH } from 'src/app/app.component';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { HttpService } from 'src/app/Services/Http.service';
import { UserService, USER_AUTH } from 'src/app/Services/User.service';

@Component({
    selector: 'app-purchase-page',
    templateUrl: './PurchasePage.component.html',
    styleUrls: ['./PurchasePage.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class PurchasePage implements OnInit{
    amountToPay$: Observable<number>;
    isPolicyAccepted = false;

    constructor(public user: UserService,
                private http: HttpService,
                private router: Router,
                private _snackBar: MatSnackBar){}

    ngOnInit(): void{
        USER_AUTH.subscribe(() => {
            this.http.get<{ data: { active: IAd[], unactive: IAd[] }, amount_of_orders: number, amount_of_products: number }>(`${URL_PATH}api/get-orders/`)
                .subscribe( v => {
                    this.user.addActiveProducts(v.data.active);
                    this.user.addUnactiveProducts(v.data.unactive);
            });

            this.amountToPay$ =  interval(1000)
                                 .pipe(
                                     take(6),
                                     skipWhile(v => !this.user.activeOrders.length),
                                     switchMap(v => {
                                        return from(this.user.activeOrders)
                                             .pipe(
                                                 reduce((prev, curr) => {
                                                     const item = curr.count * curr.price;
                                                     return item + prev;
                                                 }, 0)
                                             );
                                     })
                                 );
        });

        this.authenticate();
    }

    purchase(): void{
        if (!this.isPolicyAccepted){
            this._snackBar.open('Дайте согласие на обработку персональных данных. Иначе оформить покупку не получится', 'Close', {
                duration: 10000
            });
        } else{
            this._snackBar.open('Возникли проблемы с сервером', 'Close', {
                duration: 10000
            });
        }
    }

    authenticate(): void{
        interval(1000)
            .pipe(
                takeUntil(USER_AUTH),
                take(5)
            ).subscribe(
                () => {
                    console.log('waiting');
                },
                () => {
                    this._snackBar.open('Произошла ошибка, связанная с сервером', 'Close');
                },
                () => {
                    if (!this.user.is_auth) {
                        this.router.navigateByUrl('/authenticate');
                    }
                });
    }
}
