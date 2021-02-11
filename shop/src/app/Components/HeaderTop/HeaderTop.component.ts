import { Component } from "@angular/core";
import { User } from "src/app/Services/User.service";

@Component({
    selector: 'app-header-top',
    templateUrl: './HeaderTop.component.html',
    styleUrls: ['./HeaderTop.component.scss']
})
export class HeaderTop{
    constructor(private user: User){}

    get isAuth(): boolean{
        return this.user.is_auth;
    }
}