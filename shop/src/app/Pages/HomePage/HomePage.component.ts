import {Component} from '@angular/core';
import { URL_PATH } from 'src/app/app.component';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { HttpService } from 'src/app/Services/Http.service';


@Component({
    selector:"home",
    templateUrl:"./HomePage.component.html",
    styleUrls: ['./HomePage.component.scss']
})
export class HomePage {
    ads:IAd[]=[];

    constructor(private http:HttpService){}

    ngOnInit():void{
        window.scrollTo(0,0);
        this.http.get<{ data: IAd[] }>(`${URL_PATH}api/products?page=1`,{}).subscribe(v=>{
            if((v.data||[]).length){
                this.ads=v.data;
            }
        });
    }
}
