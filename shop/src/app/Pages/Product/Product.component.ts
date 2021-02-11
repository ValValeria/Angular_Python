import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from "@angular/router";
import { URL_PATH } from "src/app/app.component";
import { ProductPageImage } from "src/app/Components/ProductPageImage/ProductPageImage.component";
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
    charactarictics: [string, string][];
    count = 1;
    maxCount = 0;
    @ViewChild('drawer', {read: MatDrawer}) drawer: MatDrawer;
    products: IAd[] = [];

    constructor(private http: Http,
                private route: ActivatedRoute,
                private router: Router,
                public user: User,
                private snackBar: MatSnackBar,
                private diaglog: MatDialog){

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

        this.http.get<{ data: IAd[] }>(`${URL_PATH}api/products?page=1`, {}).subscribe(v => {
            if ((v.data || []).length) {
                this.products = v.data;
            }
        });
        
        USER_AUTH.subscribe(v1 => {
            if (v1){
                this.http.get<{ data: { count: number } }>(`${URL_PATH}api/product-count/?product_id=` + this.postId).
                    subscribe(v => {
                        this.maxCount = v.data.count;
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
                          this.snackBar.open("Товар добавлен в корзину", "Закрыть", {
                              duration: 5000
                          });
                      } else{
                          this.snackBar.open("Похоже, этот товар закончился", "Закрыть", {
                              duration: 10000
                          });
                      }
                  });
          }else{
              this.snackBar.open('Выбирите нужное количество товара', "Закрыть", {
                  duration: 5000
              });   
          }
      }
    }

    showImages(): void{
      if (this.post.image.length){
          this.diaglog.open(ProductPageImage, {
              data: { src: this.post.image },
              width: "80%",
              height: "60%",
              maxWidth: "900px"
          });
      }
    }
}
