import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticateHelper} from '../Classes/authenticate-helper.service';
import {UserService} from '../Services/User.service';

@Injectable()
export class OnlyAuthGuard implements CanActivate{

   constructor(private user: UserService,
               private auth: AuthenticateHelper,
               private router: Router){}

   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
     await this.auth.authenticate(this.user, true);

     if (!this.user.is_auth){
       setTimeout(() => this.router.navigateByUrl('/'));

       return false;
     }

     return true;
   }
}
