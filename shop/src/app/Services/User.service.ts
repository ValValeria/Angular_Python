import { Injectable } from "@angular/core";
import { IAd, IUser } from "../Interfaces/Interfaces";
import {compact} from 'lodash';


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
    }

    addActiveProducts(product: IAd[]): void{
        this.activeOrders.push(...compact(product));
    }

    addUnactiveProducts(product: IAd[]): void{
        this.unactiveOrders.push(...compact(product));
    }
}

