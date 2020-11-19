import { Component } from "@angular/core";
import { Http } from "src/app/Services/Http.service";
import { User } from "src/app/Services/User.service";
import { Router } from '@angular/router';

@Component({
    selector:"admin",
    templateUrl:"./AdminPage.component.html",
    styleUrls:['./AdminPage.component.scss']
})
export class AdminPage{
    constructor(private http:Http,public user:User,public router:Router){}

    ngOnInit():void{
         /*if(!this.user.is_auth){
             this.router.navigateByUrl("/")
         }*/
    }
}