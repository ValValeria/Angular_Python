import { Injectable } from "@angular/core";
import { IAd, IUser } from "../Interfaces/Interfaces";
import {compact, isEqual, uniqWith} from 'lodash';
import { Subject } from 'rxjs';

export const USER_AUTH = new Subject<boolean>();


@Injectable({providedIn:"root"})
export class User implements IUser{
    username: string;
    email: string;
    password: string;
    is_auth: boolean;
    activeOrders: IAd[] = [];
    avatar:string;
    unactiveOrders: IAd[] = [];
    id:number;

    login(data: Partial<IUser>): void{
        this.username = data.username ;
        this.email = data.email;
        this.password = data.password;
        this.is_auth = true;
        this.avatar = data.avatar;
        this.id = data.id;
        USER_AUTH.next(true);
    }

    addActiveProducts(product: IAd[]): void{
        this.activeOrders.push(...compact(product));
        this.activeOrders = uniqWith(this.activeOrders, isEqual);
    }

    addUnactiveProducts(product: IAd[]): void{
        this.unactiveOrders.push(...compact(product));
        this.activeOrders = uniqWith(this.activeOrders, isEqual);
    }
}

