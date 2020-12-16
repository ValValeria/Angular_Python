import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IAd } from '../../Interfaces/Interfaces';
import { ImageLoading } from '../../Classes/ImageLoading';
import { Router } from '@angular/router';
import { URL_PATH } from 'src/app/app.component';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector:"card",
    templateUrl:"./CardSmall.component.html",
    styleUrls:["./CardSmall.component.scss"]
})
export class CardSmall extends ImageLoading{
    @Input("card") card:IAd;
    readonly url:string = "http://127.0.0.1:8000"
    @ViewChild("img",{read:ElementRef}) public image:ElementRef;

    constructor(private router: Router, 
                private user: User, 
                private http: Http,
                private _snackBar: MatSnackBar){
        super();
    }

    buyItem(): void {
        if (!this.user.is_auth) {
            this._snackBar.open("Только авторизированные пользователи могут добавлять товар в корзину", "Закрыть", {
                duration: 5000
            });
        } else {
            this.http.get<{ messages: string[], data: string[], status: string }>(`${URL_PATH}api/addorder?product_id=${this.card.id}&count=${1}`)
            .subscribe(v => {
                if (v.status == "ok") {
                    this._snackBar.open("Товар добавлен в корзину", "Закрыть", {
                        duration: 5000
                    });
                }
             });
        }
    }
}