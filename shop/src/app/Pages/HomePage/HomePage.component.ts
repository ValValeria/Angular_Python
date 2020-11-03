import {Component} from '@angular/core';
import { ImageLoading } from 'src/app/Classes/ImageLoading';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';

@Component({
    selector:"home",
    templateUrl:"./HomePage.component.html"
})
export class HomePage extends ImageLoading{
    ads:IAd[]=[];

    constructor(private http:Http){
        super();
    }

    ngOnInit():void{
        window.scrollTo(0,0);
        this.http.get<IAd[]>("http://127.0.0.1:8000/api/products").subscribe(v=>{
            if((v||[]).length){
                this.ads=v;
            }
        });
    }
}