import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IAd, ProductsBrand, ProductsInfo } from 'src/app/Interfaces/Interfaces';
import { HttpService } from 'src/app/Services/Http.service';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { URL_PATH } from 'src/app/app.component';

interface IResponse {
    data: IAd[];
    has_next: boolean;
}

@Component({
  // tslint:disable-next-line:component-selector
    selector: 'products',
    templateUrl: './Products.component.html',
    styleUrls: ['./Products.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                query('.card-sm', [
                    style({
                        opacity: 0
                    }),
                    stagger('250ms', [
                        animate('1.2s ease-out', style({
                            opacity: 1
                        }))]
                    )
                ])
            ]),
        ])
    ]
})
export class Products implements OnInit, AfterViewInit {
    products: IAd[];
    disabled = true;
    panelOpenState = false;
    categories: string[];
    @ViewChild('productsElem', { read: ElementRef }) productsElem: ElementRef;
    @ViewChild('search', { read: TemplateRef }) search: TemplateRef<any>;
    @ViewChild('product_search', { read: ElementRef }) matSearchContainer: ElementRef;
    @ViewChild('mediaSearch', { read: TemplateRef }) matMediaSearchContainer: TemplateRef<any>;
    @Input('isSearch') isSearchPage = false;
    @Input() isCategoryPage = false;
    @Input() searchText = '';
    maxPrice: number;
    brands: string[];
    activeCategory: string;
    activeBrand: string;
    page = 1;
    hasNext = false;
    isEmpty: boolean;
    sentHttp: boolean;
    maxPriceValue = 4000;
    readonly MIN_WIDTH: number = 950;
    showModel = false;
    minPrice = 0;
    urls: [string, string][];
    carouselImages: string[];

    constructor(private http: HttpService,
                private dialog: MatDialog,
                private router: Router,
                private snackBar: MatSnackBar,
                private route: ActivatedRoute) {
        this.products = [];
        this.categories = [];
        this.carouselImages = ['/assets/image1.webp'];
    }

    ngOnInit(): void {
        this.sentHttp = true;

        let url = `${URL_PATH}api/info-products/`;

        if (this.isSearchPage) {
            url += '&search=' + encodeURIComponent(this.searchText);
            this.urls = [['/', 'Главная'], ['/products', 'Продукты'], ['/search', 'Поиск']];
        } else if (this.isCategoryPage) {
            url += '&category=' + encodeURIComponent(this.activeCategory);
            this.urls = [['/', 'Главная'], ['/category', 'Категории']];
        } else{
            this.urls = [['/', 'Главная'], ['/products', 'Продукты']];
        }

        this.http.get<ProductsInfo>(url).subscribe(v => {
            this.categories = v.data.categories;
            this.maxPrice = v.data.price[1].max_price;
            this.maxPriceValue = v.data.price[1].max_price;

            if (this.isCategoryPage) {
                this.route.paramMap.subscribe(v2 => {
                    setTimeout(() => {
                        this.activeCategory = v2.get('category');
                        this.formRequest(false);
                    }, 0);
                });
            } else {
                this.formRequest(false);
            }
        });
    }

    undoCategory(): void {
        this.undoSearch();
    }

    showMenu(): void {
      this.dialog.open(this.matMediaSearchContainer, {
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw'
      });

      document.body.classList.add('overflow-hidden');

      this.dialog.afterAllClosed.subscribe(v => {
         document.body.classList.remove('overflow-hidden');
      });
    }

    checkData(): void {
        if (!this.products.length) {
            this.isEmpty = true;
        } else {
            this.isEmpty = false;
        }
        this.sentHttp = false;
    }

    ngAfterViewInit(): void {

        this.getBrands({ value: '' });

        const onScroll = () => {
            const func = () => {
                const width = document.documentElement.clientWidth;

                if (width < this.MIN_WIDTH) {
                    this.showModel = true;
                } else {
                    this.showModel = false;
                }

                this.dialog.afterOpened.subscribe(v => {
                    const matSearchContainer = document.querySelector('.product__search-wrap');
                    matSearchContainer.classList.add('shadow-none');

                    const matDialog = document.querySelector('mat-dialog-container');
                    matDialog.classList.add('bg-white');
                });

                this.dialog.afterAllClosed.subscribe(v => {
                    const matSearchContainer = document.querySelector('.product__search-wrap');
                    if (matSearchContainer) {
                        matSearchContainer.classList.remove('shadow-none');
                    }
                });
            };
            setTimeout(func.bind(this), 0);
        };

        window.onresize = onScroll.bind(this);

        onScroll();
    }

    getBrands($event: { value: string }): void {
        setTimeout(() => {
            this.activeCategory = $event.value || '';

            let url = `${URL_PATH}api/getbrands/?category=` + encodeURIComponent(this.activeCategory);

            if (this.isSearchPage) {
                url += '&search=' + encodeURIComponent(this.searchText);
            }

            this.http.get<ProductsBrand>(url)
                .subscribe((v) => {
                    this.brands = v.data.brands;
                });
        }, 0);
    }

    sort(next = false): void | null {
        this.sentHttp = true;

        this.dialog.closeAll();

        if (this.minPrice === this.maxPrice) {
            this.snackBar.open('Минимальная цена не должна равняться максимальной', 'Close');
            return;
        }

        if (this.minPrice > this.maxPrice) {
            this.snackBar.open('Минимальная цена не должна быть  больше максимальной', 'Close');
            return;
        }

        this.dialog.afterAllClosed.subscribe(this.formRequest.bind(this));
    }

    formRequest(next): void {
        if (!next) {
            this.page = 1;
            this.products = [];
        }
        const config = {
            params: new HttpParams().set('min', this.minPrice.toString())
                .set('max', this.maxPrice.toString())
                .set('category', this.activeCategory || '')
                .set('brand', this.activeBrand || '')
                .set('page', String(this.page))
        };

        const url = `${URL_PATH}api/sort/`;

        if (this.isSearchPage) {
            config.params.set('search', this.searchText);
        }

        this.http.get<IResponse>(url, config).subscribe(v => {
            if (v.data.length) {

                v.data.forEach(element => {
                    const index = this.products.findIndex(v => Number(v.id) === Number(element.id));

                    if (index === -1) {
                        this.products.push(element);
                    }
                });

                this.hasNext = v.has_next;

                const decideScroll = () => {
                    const offset = this.productsElem.nativeElement.offsetTop;
                    const height = this.productsElem.nativeElement.clientHeight;
                    if (pageYOffset + 500 > offset && (height + offset) > pageYOffset && this.products.length) {
                        this.disabled = false;
                    }
                };

                decideScroll();
                window.addEventListener('scroll', decideScroll.bind(this));
            }
            this.checkData();
        });
    }

    changeBrand($event): void {
        this.activeBrand = $event.value;
    }

    showNext(): void {
        this.page = this.page + 1;
        this.sort(true);
    }

    undoSearch(): void {
        this.router.navigateByUrl('/products').then(r => console.log('navigated'));
    }

    activePrice(): string{
        const str = `Товары от ${this.minPrice}грн до ${this.maxPrice}грн`;
        return str;
    }

    close(): void{
        this.dialog.closeAll();
    }
}
