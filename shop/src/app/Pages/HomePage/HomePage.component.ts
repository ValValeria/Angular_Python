import {Component} from '@angular/core';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';

@Component({
    selector:"home",
    templateUrl:"./HomePage.component.html"
})
export class HomePage{
    ads:IAd[]=[];

    constructor(private http:Http){}

    ngOnInit():void{
        this.http.get<IAd[]>("http://127.0.0.1:8000/api/products").subscribe(v=>{
            if(v.length){
                this.ads=v;
            }
        });
    }
}