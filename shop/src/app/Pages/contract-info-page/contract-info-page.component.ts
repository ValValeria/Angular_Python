import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-contract-info-page',
  templateUrl: './contract-info-page.component.html',
  styleUrls: ['./contract-info-page.component.scss']
})
export class ContractInfoPageComponent{
  urls: [string, string][];

  constructor(private router: Router) {
    this.urls = [['/', 'Главная'], [router.url, 'Гарантия']];
  }
}
