import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {UserService} from '../Services/User.service';
import {AuthenticateHelper} from '../Classes/authenticate-helper.service';
import {MatSnackBar} from '@angular/material/snack-bar';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user'
}

@Injectable({
  providedIn: 'root'
})
export class OnlySuperAdminGuard implements CanActivate {
  constructor(private user: UserService,
              private auth: AuthenticateHelper,
              private router: Router,
              private snackBar: MatSnackBar
              ){}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>{

    if (!this.user.is_auth) { await this.auth.authenticate(this.user, true); }

    if (this.user.role !== Roles.ADMIN){
      this.snackBar.open('Only admin can visit the page', 'Close');

      await this.router.navigateByUrl('/');

      return false;
    }

    return true;
  }
}
