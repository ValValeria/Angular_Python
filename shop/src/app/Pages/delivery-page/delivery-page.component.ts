import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-delivery-page',
  templateUrl: './delivery-page.component.html',
  styleUrls: ['./delivery-page.component.scss']
})
export class DeliveryPageComponent implements OnInit {
  urls: [string, string][];
  lists: string[] = [];

  constructor(private router: Router) {
    this.urls = [['/', 'Главная'], [router.url, 'Доставка']];
    this.lists = [
      'при стоимости заказа от 1 500 грн — оплачивается интернет-магазином INDigital (согласно тарифам сервиса доставки);',
      'при стоимости заказа до 1 500 грн — оплачивается покупателем (согласно тарифам сервиса доставки).',
      'Адресная доставка неоплаченного заказа на сумму более 50 000 грн не осуществляется.'
    ];
  }

  ngOnInit(): void {
  }
}
