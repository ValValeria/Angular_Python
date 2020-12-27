import { AfterViewInit, Component, DoCheck, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthenticateClass } from './Classes/Authenticate';
import { User } from './Services/User.service';

export const URL_PATH = 'http://127.0.0.1:8000/';

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
export class AppComponent implements OnInit, AfterViewInit, DoCheck {
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
    (new AuthenticateClass()).authenticate(this.user,
      true).catch(e => console.log('Status:guest'));

    document.addEventListener('keydown', ($event) => {
      $event.preventDefault();
      const top = parseInt(getComputedStyle(this.btn).getPropertyValue('top'), 10);
      let coor: number;

      switch ($event.code) {
        case 'ArrowDown':
          coor = top + this.btn.clientHeight * 0.25;
          break;
        case 'ArrowUp':
          coor = top - this.btn.clientHeight * 0.25;
          break;
        default:
          break;
      }

      if (coor + this.btn.clientHeight * 0.14 >= 0 && coor + this.btn.clientHeight < document.documentElement.clientHeight) {
          scrollEvent(coor);
          this.render.setStyle(this.btn, 'top', coor + 'px');
      }
    });
  }

  ngDoCheck(): void {
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollHeight !== this.initAppHeight) {
      this.checkForScrollHeight();
    }
  }

  ngAfterViewInit(): void {
    window.onload = () => {
      setTimeout(() => {
        this.checkForScrollHeight();
      }, 0);
    };
  }

  checkForScrollHeight(): void {
    const scrollHeight = document.documentElement.scrollHeight;
    this.initAppHeight = scrollHeight;
    const windowHeight = document.documentElement.clientHeight;

    if (scrollHeight > windowHeight) {
      this.isDisplayScroll = true;

      setTimeout(() => {
        const scrollElem = document.querySelector('.slider');
        const pers = windowHeight / scrollHeight;
        this.btnHeight.height = Math.round(scrollElem.clientHeight * pers * 0.8) + 'px';
        window.scrollTo(0, 0);
        this.btn = document.querySelector('.slider__btn-container > button');
      }, 0);
    }

    this.router.events.subscribe(v => {
      if (v instanceof RoutesRecognized) {
        window.scrollTo(0, 0);
      }
    });
  }

  scroll($event: MouseEvent, isClick: boolean): void {

    $event.preventDefault();

    if (this.isButtonClicked || isClick) {
      let numTop = $event.clientY;
      numTop = numTop - this.btn.clientHeight / 2;
      const trufy = numTop + this.btn.clientHeight < document.documentElement.clientHeight;

      if (! trufy) {
        numTop = document.documentElement.clientHeight - this.btn.clientHeight;
      } else if (numTop < 0) {
        numTop = 0;
      } 

      this.render.setStyle(this.btn, 'top', numTop + 'px');
      scrollEvent(numTop);
    }
  }

  mousedown($event): void {
    $event.preventDefault();
    this.isButtonClicked = true;
  }

  mouseup($event): void {
    $event.preventDefault();
    this.isButtonClicked = false;
  }
}
