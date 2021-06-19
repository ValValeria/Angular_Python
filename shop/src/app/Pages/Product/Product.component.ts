import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { URL_PATH } from 'src/app/app.component';
import { ProductPageImage } from 'src/app/Components/ProductPageImage/ProductPageImage.component';
import {IAd, IResponse} from 'src/app/Interfaces/Interfaces';
import { HttpService } from 'src/app/Services/Http.service';
import { User, USER_AUTH } from 'src/app/Services/User.service';
import {HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs/internal/Subject';

export const handleClose$ = new Subject();

@Component({
    selector: 'app-product',
    templateUrl: './Product.component.html',
    styleUrls: ['./Product.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class Product implements OnInit, AfterViewInit {
    postId: number;
    post: IAd;
    pageIndex = 1;
    charactarictics: [string, string][];
    count = 1;
    maxCount = 0;
    @ViewChild('drawer', { read: MatDrawer }) drawer: MatDrawer;
    products: IAd[] = [];
    otherPosts: IAd[] = [];
    showDrawer = false;

    constructor(private http: HttpService,
                private route: ActivatedRoute,
                private router: Router,
                public user: User,
                private snackBar: MatSnackBar,
                private diaglog: MatDialog,
                ) {

        this.route.paramMap.subscribe(v => {
            this.postId = Number(v.get('id'));
        });
        this.charactarictics = [];
        this.post = {
          brand: '',
          category: '',
          characterictics: '',
          count: 0,
          descr: '',
          id: 0,
          image: '',
          long_description: '',
          price: 0,
          short_description: '',
          status: undefined,
          title: ''
        };
    }

    ngOnInit(): void {
        this.http.get<{ data: IAd }>(`${URL_PATH}api/product/` + this.postId).subscribe(
            v => {
                this.post = v.data;
                this.charactarictics = this.post.characterictics.split(';').map(str => {
                    const array = str.split(':');
                    return [array[0], array[1]];
                });
            }
        );

        this.http.get<{ data: IAd[] }>(`${URL_PATH}api/products?page=1`, {}).subscribe(v => {
            if ((v.data || []).length) {
                this.products = v.data;
            }
        });

        USER_AUTH.subscribe(v1 => {
            if (v1) {
                this.http.get<{ data: { count: number } }>(`${URL_PATH}api/product-count/?product_id=` + this.postId).
                    subscribe(v => {
                        this.maxCount = v.data.count;
                    });
            }
        });

        handleClose$.subscribe(v => {
          this.diaglog.closeAll();
        });
    }

    ngAfterViewInit(): void {
        const footer = document.querySelector('footer');
        const func = () => {
            const sidebar: HTMLElement = document.querySelector('.product__sidebar ');

            if (sidebar) {
                const header = Array.from(document.querySelectorAll('header')).find(v => {
                    return getComputedStyle(v).display !== 'none' && !v.hidden;
                });
                const headerHeight = header.getBoundingClientRect().height;
                const docElem = document.documentElement;
                const elem = document.elementFromPoint(0, docElem.clientHeight - docElem.clientTop - 1);

                if (elem.tagName.toLowerCase() === 'footer') {
                    sidebar.style.top = headerHeight + 'px';
                    sidebar.style.height = `${Math.abs(footer.offsetTop - pageYOffset - headerHeight)}px`;
                } else {
                    sidebar.style.height = '100%';
                }
            }
        };

        fromEvent(window, 'scroll').subscribe(func);

        func();
    }

    async buyItem(): Promise<void>{
        if (!this.user.is_auth) {
            await this.router.navigateByUrl('/authenticate');
        } else {
            if (this.count) {
                this.http.get<{ messages: string[], data: string[], status: string }>(`${URL_PATH}api/addorder?product_id=${this.postId}&count=${this.count}`)
                    .subscribe(v => {
                        if (v.status === 'ok') {
                            this.snackBar.open('Товар добавлен в корзину', 'Закрыть', {
                                duration: 5000
                            });
                        } else {
                            this.snackBar.open('Похоже, этот товар закончился', 'Закрыть', {
                                duration: 10000
                            });
                        }
                    });
            } else {
                this.snackBar.open('Выбирите нужное количество товара', 'Закрыть', {
                    duration: 5000
                });
            }
        }
    }

    showImages(): void {
        if (this.post.image.length) {
            this.diaglog.open(ProductPageImage, {
                data: { src: this.post.image },
                width: '100vw',
                height: '100vh',
                maxWidth: '100vw'
            });
        }
    }

   async showOtherBrands(): Promise<void>{
      try{
        const config = {
          params: new HttpParams().set('brand', this.post.brand).set('page', '1')
        };
        const response: IResponse = await this.http.get('/api/sort/', config).toPromise() as IResponse;
        const data = response?.data || [];

        this.otherPosts.push(...data);
        this.showDrawer = true;
      } catch (e) {
        console.warn('Http error ...');
      }
   }
}
