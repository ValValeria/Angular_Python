import { Component, OnInit} from '@angular/core';
import {NavigationCancel, Router} from '@angular/router';
import { AuthenticateHelper } from './Classes/authenticate-helper.service';
import { User } from './Services/User.service';
import {intersection} from 'lodash';
import {filter} from 'rxjs/operators';


export const URL_PATH = '/';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isButtonClicked = false;
  btn: HTMLButtonElement;
  isDisplayScroll = false;
  btnHeight = { height: '40px' };
  initAppHeight: number;

  constructor(
    private user: User,
    private auth: AuthenticateHelper,
    private router: Router
  ) { }

  ngOnInit(): void{
    try{
      const user = JSON.parse(localStorage.getItem('auth'));
      const requiredProperties = ['username', 'password'];

      if (user && typeof user === 'object' && intersection(requiredProperties, Object.keys(user)).length){
        this.auth.authenticate(this.user, true).catch(e => {
          this.router.navigateByUrl('/').then(r => console.log('forbidden'));
        });
      }
    } catch (e){
      console.warn('Invalid json data');
    }
  }
}
