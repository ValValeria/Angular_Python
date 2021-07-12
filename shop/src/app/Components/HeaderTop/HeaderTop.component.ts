import { Component } from "@angular/core";
import { UserService } from "src/app/Services/User.service";

@Component({
    selector: 'app-header-top',
    templateUrl: './HeaderTop.component.html',
    styleUrls: ['./HeaderTop.component.scss']
})
export class HeaderTop{
    constructor(private user: UserService){}

    get isAuth(): boolean{
        return this.user.is_auth;
    }
}
