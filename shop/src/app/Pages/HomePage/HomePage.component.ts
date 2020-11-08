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
        this.http.get<IAd[]>(this.url+"/api/products").subscribe(v=>{
            if((v||[]).length){
                this.ads=v;
            }
        });
    }
}