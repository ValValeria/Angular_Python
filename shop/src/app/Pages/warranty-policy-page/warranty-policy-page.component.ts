import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-warranty-policy-page',
  templateUrl: './warranty-policy-page.component.html',
  styleUrls: ['./warranty-policy-page.component.scss']
})
export class WarrantyPolicyPageComponent{
  urls: [string, string][];

  constructor(private router: Router) {
    this.urls = [['/', 'Главная'], [router.url, 'Гарантия']];
  }
}
