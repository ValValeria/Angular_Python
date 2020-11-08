import { Component} from '@angular/core';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';

@Component({
    selector:"products",
    templateUrl:"./Products.component.html",
    styleUrls:['./Products.component.scss']
})
export class Products {
     products: IAd[];

     constructor(private http:Http){
     }

     ngOnInit():void{
         window.scrollTo(0,0);
         this.http.get<IAd[]>("http://127.0.0.1:8000/api/products").subscribe(v=>{
            if((v||[]).length){
                this.products=v;
            }
         });
     }
}