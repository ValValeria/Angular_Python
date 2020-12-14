import {Component} from '@angular/core';
import { URL_PATH } from 'src/app/app.component';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';


@Component({
    selector:"home",
    templateUrl:"./HomePage.component.html"
})
export class HomePage {
    ads:IAd[]=[];
    
    constructor(private http:Http){}

    ngOnInit():void{
        window.scrollTo(0,0);
        this.http.get<{ data: IAd[] }>(`${URL_PATH}api/products?page=1`,{}).subscribe(v=>{
            if((v.data||[]).length){
                this.ads=v.data;
            }
        });
    }
}