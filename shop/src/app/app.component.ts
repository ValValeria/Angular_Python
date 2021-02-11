import { AfterViewInit, Component, DoCheck, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthenticateClass } from './Classes/Authenticate';
import { User } from './Services/User.service';

export const URL_PATH = '/';

const scrollEvent = (top: number) => {
  const scrollElem = document.querySelector('.slider');
  const pers = top / scrollElem.clientHeight;
  const moveToY = Math.round(document.documentElement.scrollHeight * pers);

  window.scrollTo(0, moveToY);
};

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

  ngOnInit(): void {
    (new AuthenticateClass()).authenticate(this.user, true).catch(e => console.log('Status:guest'));
  }
}
