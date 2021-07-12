import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef, SkipSelf,
  ViewChild
} from '@angular/core';
import {HttpService} from 'src/app/Services/Http.service';
import {UserService} from 'src/app/Services/User.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ChartType} from 'chart.js';
import {MultiDataSet} from 'ng2-charts';
import {$CHOOSE_ITEM, $DELETE_ITEMS, $ORDER_COUNT, OrderListComponent} from 'src/app/Components/OrderList/OrderList.component';
import {pull, uniq} from 'lodash';
import {IAd, IUser} from 'src/app/Interfaces/Interfaces';
import {from, fromEvent} from 'rxjs';
import {auditTime, mergeMap} from 'rxjs/operators';
import {ImageLoading} from 'src/app/Classes/ImageLoading';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LIKES$} from 'src/app/Components/OrdersLikes/OrdersLikes.component';
import {URL_PATH} from 'src/app/app.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AdminDashboardFullComponent} from '../../Components/admin-dashboard-full/admin-dashboard-full.component';

@Component({
    selector: 'app-admin',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    providers: [UserService]
})
export class AdminPageComponent extends ImageLoading implements AfterViewInit, AfterContentInit{
    orderCount = 0;
    doughnutChartType: ChartType = 'doughnut';
    public doughnutChartLabels: string[] = [];
    public doughnutChartData: MultiDataSet;
    public selectedCount = 0;
    public selectedItems: number[] = [];
    public selectedLikes: number[] = [];
    public isMedia = false;
    readonly MAX_WIDTH = 1100;
    @ViewChild('orders_active', {read: OrderListComponent}) ordersArea: OrderListComponent;
    @ViewChild('file', {read: ElementRef}) file: ElementRef;
    message = '';
    errors: string[] = [];
    urls: [string, string][];
    private id: number;
    private isUserProfile = true;

    constructor(private http: HttpService,
                public router: Router,
                private snackBar: MatSnackBar,
                private matDialog: MatDialog,
                private route: ActivatedRoute,
                public user: UserService,
                @SkipSelf() public currentUser: UserService
    ){
        super();

        this.urls = [['/', 'Главная'], [router.url, 'Профиль']];

        this.user = new UserService();

        route.paramMap.subscribe(v => {
          this.id = parseInt(v.get('id'), 10);

          this.http.get<{data: {user: IUser}, status: string}>(`/api/user/${this.id}`).subscribe(v1 => {
            if (v1.status === 'error'){
              this.snackBar.open('The user doesn\'t exist', 'Close');

              setTimeout(async () => {
                await this.router.navigateByUrl('/');
              }, 1000);
            } else {
              this.user.loadUserData(v1.data.user);

              if (this.user.id === this.id){
                this.isUserProfile = true;
              } else {
                this.isUserProfile = false;
              }

              this.http.get<{ data: { active: IAd[], unactive: IAd[] }, amount_of_orders: number, amount_of_products: number }>(`/api/get-orders/${this.user.id}`)
                .subscribe(v => {
                  this.user.addActiveProducts(v.data.active);
                  this.user.addUnactiveProducts(v.data.unactive);
                });
            }
          });
        });
    }

    ngAfterViewInit(): void {
        window.onload = () => {
           document.querySelector('header').classList.add('bg-dark');
        };

        LIKES$.subscribe(v => {
            if (!this.selectedLikes.includes(v)) {
                this.selectedLikes.push(v);
            } else {
                this.selectedLikes.splice(this.selectedLikes.indexOf(v), 1);
            }
        });

        $ORDER_COUNT.subscribe(elem => {
            setTimeout(() => {
                if (elem[1].id === this.user.id){
                  this.orderCount = elem[0];

                  this.doughnutChartLabels = uniq(this.user.activeOrders.map(v => v.brand));

                  const numbers: number[] = [];

                  this.doughnutChartLabels.forEach(item => {
                    const sortByCat: IAd[] = this.user.activeOrders.filter(v => v.brand === item);
                    let num = sortByCat.reduce((prev, current) => prev + current.count, 0);
                    console.log(num);
                    num = Math.round((num * 100) / this.orderCount);
                    numbers.push(num);
                  });

                  this.doughnutChartData = [numbers];
                }
            }, 0);
        });

        fromEvent(window, 'load')
          .pipe(
            mergeMap(v => fromEvent(window, 'resize').pipe(auditTime(100)))
          ).subscribe(v => {
             if (window.matchMedia(`(max-width:${this.MAX_WIDTH}px)`).matches) {
                this.isMedia = true;
             } else {
                this.isMedia = false;
             }
          });

        window.onload = () => {
          if (window.matchMedia(`(max-width:${this.MAX_WIDTH}px)`).matches) {
            this.isMedia = true;
          } else {
            this.isMedia = false;
          }
        };
    }

    ngAfterContentInit(): void {
        $CHOOSE_ITEM.subscribe(v => {
            if (v[0] === 'products_buy' && v[2].id === this.user.id){
                if (!this.selectedItems.includes(v[1])) {
                    this.selectedCount += 1;
                    this.selectedItems.push(v[1]);
                } else {
                    pull(this.selectedItems, v[1]);
                    this.selectedCount -= 1;
                }
            }
        });
    }

    delete_orders(): void{
        this.message = '';
        this.errors = [];

        let result = '';

        this.selectedItems.forEach(v => {
            result += `product_id=${v}&`;
        });

        result = result.slice(0, -1);

        this.http.get<{ status: string }>(`${URL_PATH}api/deleteorder?${result}`)
        .subscribe(
        v => {
            this.snackBar.open('Товары удалены', 'Закрыть', {
                duration: 10000
            });
            $DELETE_ITEMS.next([this.selectedItems, this.user]);
            this.orderCount -= 1;
        },
        e => {
            this.snackBar.open('Произошла ошибка. Перезагрузите страницу', 'Закрыть', {
                duration: 10000
            });
        });
    }

    change_orders(): void{
        let status = false;
        this.message = '';
        this.errors = [];

        from(this.selectedItems)
        .pipe(
           mergeMap(v => {
               return this.http.get<{ 'messages': string[], 'data': string[], 'status': string }>(`${URL_PATH}api/addorder/?product_id=${v}&count=${this.ordersArea.productsCount[v]}`);
           }),
        )
        .subscribe(
        (v) => {
           this.message = 'Отправляем запрос';

           if (v.status === 'ok'){
               status = true;
           } else{
               status = false;
               this.errors.push(...v.messages);
           }
        },
        (e) => {
           this.snackBar.open('Что-то пошло не так. Пожалуйста, перезагрузите страницу', 'Закрыть', {
               duration: 2000
           });
           this.message = '';
        },
        () => {
           if (status){
               this.snackBar.open('Ваша корзина изменена', 'Закрыть', {
                   duration: 10000
               });
           }
           this.message = '';
        });
    }

    deleteLike(): void{
        let result = '';

        for (const iterator of this.selectedLikes) {
            result += `product_id=${iterator}&`;
        }

        result = result.slice(0, -1);

        this.http.get<{ 'status': 'ok' }>(`${URL_PATH}api/delete-likes/?${result}`).
        subscribe(v => {
            if (v.status === 'ok'){
                this.snackBar.open('Удалено');
            }
            $DELETE_ITEMS.next([this.selectedLikes, this.user]);
        });
    }

    async oplata(): Promise<any>{
       await this.router.navigateByUrl('/buy-orders');
    }

    openUserPhoto(): void{
       const dialog: MatDialogRef<AdminDashboardFullComponent> = this.matDialog.open( AdminDashboardFullComponent, {
         height: '100vh',
         width: '100vw',
         maxWidth: '100vw'
       });

       dialog.componentInstance.close$.subscribe(v => {
         dialog.close();
       });
    }

    public isSuperUser(): boolean{
      return this.user.is_auth && this.user.role === 'admin';
    }
}

