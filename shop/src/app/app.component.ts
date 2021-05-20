import { AfterViewInit, Component, DoCheck, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Authenticate } from './Classes/Authenticate';
import { User } from './Services/User.service';
import {intersection} from 'lodash';


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
    private render: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void{
    try{
      const user = JSON.parse(localStorage.getItem('auth'));
      const requiredProperties = ['username', 'password'];

      if (user && typeof user === 'object' && intersection(requiredProperties, Object.keys(user)).length){
        (new Authenticate()).authenticate(this.user, true).catch(e => console.log(e));
      }
    } catch (e){
      console.warn('Invalid json data');
    }
  }
}
