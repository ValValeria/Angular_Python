import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IAd } from "src/app/Interfaces/Interfaces";
import { Http } from "src/app/Services/Http.service";

@Component({
    selector:"product",
    templateUrl:"./Product.component.html",
    styleUrls:["./Product.component.scss"]
})
export class Product{
    postId:number;
    post: IAd;
    readonly url:string = "http://127.0.0.1:8000";

    constructor(private http:Http,private router:ActivatedRoute){
        this.router.paramMap.subscribe(v=>{
            this.postId = Number(v.get("id"))
        })
    }

    ngOnInit():void{
        this.http.get<IAd>("http://127.0.0.1:8000/api/product/"+this.postId).subscribe(
            v=>{
                this.post = v;
            }
        )
    }
}