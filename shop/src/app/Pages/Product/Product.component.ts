import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from "@angular/router";
import { URL_PATH } from "src/app/app.component";
import { IAd } from "src/app/Interfaces/Interfaces";
import { Http } from "src/app/Services/Http.service";
import { User, USER_AUTH } from 'src/app/Services/User.service';

@Component({
    selector:'app-product',
    templateUrl:"./Product.component.html",
    styleUrls:["./Product.component.scss"]
})
export class Product implements OnInit{
    postId: number;
    post: IAd;
    pageIndex = 1;
    readonly url = 'http://127.0.0.1:8000/'.slice(0,-1);
    charactarictics: [string, string][];
    count = 1;
    maxCount = 0;

    constructor(private http: Http,
                private route: ActivatedRoute,
                private router: Router,
                public user: User,
                private _snackBar: MatSnackBar){

        this.route.paramMap.subscribe(v => {
            this.postId = Number(v.get('id'));
        });
        this.charactarictics = [];
    }

    ngOnInit(): void{
        this.http.get<{data: IAd}>(`${URL_PATH}api/product/` + this.postId).subscribe(
            v => {
                this.post = v.data;
                this.charactarictics = this.post.characterictics.split(';').map(str => {
                    const array = str.split(':');
                    return [array[0], array[1]];
                });
            }
        );
        
        USER_AUTH.subscribe(v1 => {
            if (v1){
                this.http.get<{ data: { count: number } }>(`${URL_PATH}api/product-count/?product_id=` + this.postId).
                    subscribe(v => {
                        this.maxCount = v.data.count;
                        console.log(this.maxCount)
                    });
            }
        });
    }

    buyItem(): void{
      if (!this.user.is_auth) {
          this.router.navigateByUrl("/authenticate");
      } else{
          if(this.count){
              this.http.get<{ messages: string[], data: string[], status: string }>(`${URL_PATH}api/addorder?product_id=${this.postId}&count=${this.count}`)
                  .subscribe(v => {
                      if (v.status == "ok") {
                          this._snackBar.open("Товар добавлен в корзину", "Закрыть", {
                              duration: 5000
                          });
                      } else{
                          this._snackBar.open("Похоже, этот товар закончился", "Закрыть", {
                              duration: 10000
                          });
                      }
                  });
          }else{
              this._snackBar.open('Выбирите нужное количество товара', "Закрыть", {
                  duration: 5000
              });   
          }
      }
    }
}
