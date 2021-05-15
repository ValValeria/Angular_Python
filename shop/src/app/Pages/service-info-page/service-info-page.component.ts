import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service-info-page',
  templateUrl: './service-info-page.component.html',
  styleUrls: ['./service-info-page.component.scss']
})
export class ServiceInfoPageComponent implements OnInit {
  urls: [string, string][] = [];
  lists: string[] = [];

  constructor(private router: Router) {
    const activeUrl = router.url;
    this.urls = [['/', 'Главная'], [activeUrl, 'Возврат и обмен']];
    this.lists = [
      'с момента покупки НЕ прошло 14 дней', 'товар не имеет следов эксплуатации;',
      'сохранен товарный вид изделия и его комплектующих: отсутствуют механические повреждения, царапины, потертости, а для товаров в одноразовой (блистерной) упаковке – если упаковка не вскрывалась;',
      'есть в наличии кассовый чек (расходная накладная) о приобретении товара;'
    ];
  }

  ngOnInit(): void {
  }
}
