import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthenticateHelper} from '../Classes/authenticate-helper.service';
import {UserService} from '../Services/User.service';
import {Roles} from './only-super-admin.guard';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class OnlyAuthGuard implements CanActivate{

   constructor(private user: UserService,
               private auth: AuthenticateHelper,
               private router: Router,
               private snackBar: MatSnackBar){}

   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
     const id = parseInt(route.paramMap.get('id'), 10);

     if (!this.user.is_auth) { await this.auth.authenticate(this.user, true); }

     if (this.user.role !== Roles.ADMIN && this.user.id !== id){
       await this.router.navigateByUrl('/');

       this.snackBar.open('Only admin can visit the page', 'Close');

       return false;
     }

     return true;
   }
}
