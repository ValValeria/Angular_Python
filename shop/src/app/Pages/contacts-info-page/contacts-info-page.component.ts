import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contacts-info-page',
  templateUrl: './contacts-info-page.component.html',
  styleUrls: ['./contacts-info-page.component.scss']
})
export class ContactsInfoPageComponent{
  urls: [string, string][];
  lists: string[] = [];

  constructor(private router: Router) {
    this.urls = [['/', 'Главная'], [router.url, 'Контакты']];
    this.lists = [
      '(0-800) 30-00-33 — Горячая линия. По Украине бесплатно.',
      '(044) 390-01-93*'
    ];
  }
}
