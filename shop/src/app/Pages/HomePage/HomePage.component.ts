import {Component} from '@angular/core';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';


@Component({
    selector:"home",
    templateUrl:"./HomePage.component.html"
})
export class HomePage {
    ads:IAd[]=[];
    readonly url:string = "http://127.0.0.1:8000"

    constructor(private http:Http){
    }

    ngOnInit():void{
        window.scrollTo(0,0);
        this.http.get<{data:IAd[]}>(this.url+"/api/products?page=1",{}).subscribe(v=>{
            if((v.data||[]).length){
                this.ads=v.data;
            }
        });
    }
}