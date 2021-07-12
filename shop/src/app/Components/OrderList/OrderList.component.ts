import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import * as _ from 'lodash';
import { forEach, remove } from 'lodash';
import { Subject } from 'rxjs';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { UserService } from 'src/app/Services/User.service';


export const $ORDER_COUNT = new Subject<[number, UserService]>();
export const $CHOOSE_ITEM = new Subject<[string, number, UserService]>();
export const $DELETE_ITEMS = new Subject<[number[], UserService]>();
export const $CHOOSE_LIKES_ITEM = new Subject<[number, UserService]>();


@Component({
    selector: 'app-list',
    templateUrl: './OrderList.component.html',
    styleUrls: ['./OrderList.component.scss']
})
export class OrderListComponent implements OnInit, OnChanges{
    displayedColumns: string[];
    @Input() data: IAd[];
    @Input() isOrderList = false;
    @Input() showCount = true;
    @Input() role: string;
    @Output() selectItems = new EventEmitter<number>();
    @Input() user: UserService;
    showSelect = false;
    productsCount: {[prop: string]: number} = {};

    constructor(private detector: ChangeDetectorRef){}

    ngOnInit(): void{
        this.displayedColumns = ['delete', 'id', 'title', 'price', 'count'];

        if (!this.showCount){
            this.displayedColumns = ['id', 'title', 'price'];
        }

        if (this.role === 'purchase'){
            this.displayedColumns = ['title', 'price', 'count'];
        }

        if (this.role === 'likes') {
            this.showSelect = true;
            this.displayedColumns.unshift('delete');
        }

        $DELETE_ITEMS.subscribe(items => {
            const func = (v) => {
                return items.includes(v.id); // ?
            };
            remove(this.data, func);
            remove(this.user.activeOrders, func);
            this.detector.detectChanges();
        });
    }

    ngOnChanges(d: SimpleChanges): void {
        const data = d.data;

        if (data.isFirstChange() || !_.isEqual(data.previousValue, data.currentValue)){
            if (this.showCount){
                $ORDER_COUNT.next([this.data.length, this.user]);
            }

            if (this.data.length){
                forEach(this.data, (v) => {
                    if (v){
                        this.productsCount[v.id] = v.count;
                    }
                });
            }
        }
    }

    change(event: MatCheckboxChange): void{
        const id = Number(event.source.value);
        $CHOOSE_ITEM.next([this.role, id, this.user]);
        this.selectItems.emit(id);
    }

    changeCount(id: number , num: number): void{
        this.productsCount[id.toString()] = Number(num);
    }
}
