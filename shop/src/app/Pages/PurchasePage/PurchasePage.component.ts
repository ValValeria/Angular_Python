import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { interval } from "rxjs";
import { delayWhen, skipWhile, take, takeUntil, tap } from "rxjs/operators";
import { IAd } from "src/app/Interfaces/Interfaces";
import { Http } from "src/app/Services/Http.service";
import { User, USER_AUTH } from "src/app/Services/User.service";

@Component({
    selector: 'app-purchase-page',
    templateUrl: './PurchasePage.component.html',
    styleUrls: ['./PurchasePage.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class PurchasePage implements OnInit{

    constructor(public user: User,
                private http: Http,
                private router: Router,
                private _snackBar: MatSnackBar){}

    ngOnInit(): void{
        
        USER_AUTH.subscribe(v => {
            this.http.get<{ data: { active: IAd[], unactive: IAd[] }, amount_of_orders: number, amount_of_products: number }>('http://127.0.0.1:8000/api/get-orders/')
                .subscribe(v => {
                    this.user.addActiveProducts(v.data.active);
                    this.user.addUnactiveProducts(v.data.unactive);
                });
        });

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
