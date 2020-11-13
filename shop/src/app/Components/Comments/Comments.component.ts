import { Component, Input } from "@angular/core";
import { IComment } from "src/app/Interfaces/Interfaces";
import { Http } from "src/app/Services/Http.service";

@Component({
    selector:"comments",
    templateUrl:"./Comments.component.html",
    styleUrls:['./Comments.component.scss']
})
export class Comments{
    comments:IComment[];
    @Input("postId") productId:number;
    isSentRequest: boolean;

    constructor(private http:Http){
        this.comments=[]
    }

    ngOnInit(): void {
        this.http.get<{data:IComment[]}>("http://127.0.0.1:8000/api/comments/"+this.productId)
        .subscribe(v=>{
            this.comments = v.data;
            this.isSentRequest = true;
        })
    }
}