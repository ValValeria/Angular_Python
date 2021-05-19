import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {from, Observable} from 'rxjs';
import {Authenticate} from '../Classes/Authenticate';
import {User} from '../Services/User.service';

@Injectable()
export class AdminGuard implements CanActivate{

   constructor(private user: User){}

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     const status = (new Authenticate()).authenticate(this.user, true);
     return from(status);
   }
}
