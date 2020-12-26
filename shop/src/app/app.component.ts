import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { auditTime } from 'rxjs/operators';
import { AuthenticateClass } from './Classes/Authenticate';
import { User } from './Services/User.service';

export const URL_PATH = 'http://127.0.0.1:8000/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  isButtonClicked = false;
  btn: HTMLButtonElement;
  isDisplayScroll = false;
  btnHeight = { height: '40px' };

  constructor(
    private user: User,
    private render: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    (new AuthenticateClass()).authenticate(this.user,
      true).catch(e => console.log('Status:guest'));
  }


  ngAfterViewInit(): void {
    window.onload = () => {
      setTimeout(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          const windowHeight = document.documentElement.clientHeight;

          if (scrollHeight > windowHeight) {
            this.isDisplayScroll = true;

            setTimeout(() => {
              const scrollElem = document.querySelector('.slider');
              const pers = windowHeight / scrollHeight;
              this.btnHeight.height = Math.round(scrollElem.clientHeight * pers) + 'px';
              window.scrollTo(0, 0);
            }, 0);
          }

          this.router.events.subscribe(v => {
            if (v instanceof RoutesRecognized) {
              window.scrollTo(0, 0);
            }
          });
      }, 0);
    }
  }

  scroll($event: MouseEvent, isClick: boolean): void {
    $event.preventDefault();

    this.btn = document.querySelector('.slider__btn-container > button');

    const scrollEvent = () => {
      const scrollElem = document.querySelector('.slider');
      const top = getComputedStyle(this.btn).getPropertyValue('top');

      const pers = parseInt(top, 10) / scrollElem.clientHeight;
      const moveToY = Math.round(document.documentElement.scrollHeight * pers);

      window.scrollTo(0, moveToY);
    };

    if (this.isButtonClicked || isClick) {
      let numTop = $event.clientY;
      const numTopPrev = parseInt(getComputedStyle(this.btn).getPropertyValue('top'), 10);

      if (numTop + this.btn.clientHeight >= document.documentElement.scrollHeight) {
        return null;
      }

      if (numTop > numTopPrev) {
        numTop = numTop - this.btn.clientHeight / 2;
      } else {
        numTop = numTop + this.btn.clientHeight * 0.5;
      }

      if (isClick) {
        this.isButtonClicked = false;
        this.render.setStyle(this.btn, 'top', $event.clientY + Math.round(this.btn.clientHeight / 3)  + 'px');
      } else {
        this.render.setStyle(this.btn, 'top', numTop + 'px');
      }

      scrollEvent();
    }
  }

  mousedown(): void {
    this.isButtonClicked = true;
  }

  mouseup($event, isMouseUp = true): void {
    if (isMouseUp) {
      this.scroll($event, true);
    }

    this.isButtonClicked = false;
  }
}
