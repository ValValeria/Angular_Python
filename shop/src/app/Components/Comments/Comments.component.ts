import { Component, Input } from "@angular/core";
import { URL_PATH } from "src/app/app.component";
import { IComment } from "src/app/Interfaces/Interfaces";
import { HttpService } from "src/app/Services/Http.service";
import { User } from "src/app/Services/User.service";

@Component({
    selector:"comments",
    templateUrl:"./Comments.component.html",
    styleUrls:['./Comments.component.scss']
})
export class Comments{
    comments:IComment[];
    @Input("postId") productId:number;
    isSentRequest: boolean;
    rating:number;
    message:string;
    hasNext:boolean;
    num_pages:number;
    activePage:number = 1;

    constructor(private http:HttpService, public user:User){
        this.comments=[]
    }

    ngOnInit(): void {
        this.sendRequest()
    }

    showMore():void{
       this.activePage+=1;
       this.sendRequest();
    }

    click():void{
        if(this.user.is_auth){
            this.http.post<{ id: number, status: "ok" }>(`${URL_PATH}api/addcomment`,{"message":this.message,"rating":this.rating,post_id:this.productId})
            .subscribe(v=>{
                if(v.status=="ok"){
                    this.comments.unshift({id:(v as any).id,message:this.message,rating:this.rating,sender:{username:this.user.username}})
                }
            })
        }
    }


    sendRequest():void{
        this.http.get<{ data: IComment[], has_next: boolean, pages: number }>(`${URL_PATH}api/comments/`+this.productId+`?page=${this.activePage}`)
        .subscribe(v=>{
            this.comments.push(...v.data);
            this.isSentRequest = true;
            this.hasNext=v.has_next;
            this.num_pages = v.pages;
        })
    }
}
