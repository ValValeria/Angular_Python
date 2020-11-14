import { Injectable } from "@angular/core"
import { IUser } from "../Interfaces/Interfaces"

@Injectable({providedIn:"root"})
export class User implements IUser{
    username:string
    email:string
    password:string
    is_auth:boolean

    login(data:Partial<IUser>){
        this.username = data.username ;
        this.email = data.email;
        this.password = data.password
        this.is_auth = true;
    }
}

