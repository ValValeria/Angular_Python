import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Authenticate} from '../Classes/Authenticate';
import {User} from '../Services/User.service';

@Injectable()
export class AdminGuard implements CanActivate{

   constructor(private user: User){}

   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
     await (new Authenticate()).authenticate(this.user, true).catch(e => console.log(e));

     return this.user.is_auth;
   }
}
