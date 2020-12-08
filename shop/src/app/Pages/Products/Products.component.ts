import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, TemplateRef, ViewChild} from '@angular/core';
import { IAd, ProductsBrand, ProductsInfo } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


interface IResponse{
    data:IAd[],
    has_next:boolean
}


@Component({
    selector:"products",
    templateUrl:"./Products.component.html",
    styleUrls:['./Products.component.scss'],
    animations:[
        trigger("fadeInOut",[
            transition(":enter",[
               query(".card-sm",[
                   style({
                       opacity:0
                   }),
                   stagger("250ms",[ 
                      animate("1.2s ease-out",style({
                         opacity:1
                      }))]
                    )
               ])
            ]),
        ])
    ]
})
export class Products {
    products: IAd[];
    disabled:boolean = true;
    panelOpenState:boolean = false;
    categories: string [];
    @ViewChild("productsElem",{read:ElementRef})productsElem:ElementRef;
    @ViewChild('search',{read: TemplateRef}) search: TemplateRef<any>;
    @ViewChild('product_search', {read: ElementRef}) matSearchContainer: ElementRef;
    @Input('isSearch') isSearchPage = false;
    @Input('searchText') searchText = '';
    max_price: number;
    brands: string[];
    activeCategory:string;
    activeBrand:string;
    page:number = 1;
    hasNext:boolean=false;
    isEmpty: boolean;
    sentHttp:boolean;
    max_price_value: number=4000;
    readonly MWIDTH: number = 700;
    showModel = false;

    constructor(private http:Http, 
                private dialog: MatDialog,
                private router: Router){
         this.products = [];
         this.categories = [];
     }

     ngOnInit():void{
         this.sentHttp = true;
         let url = "http://127.0.0.1:8000/api/products?page=" + this.page;
         
         if(this.isSearchPage){
             url += '&search='+encodeURIComponent(this.searchText);
         }

         this.http.get<IResponse>(url).subscribe(v=>{
            if(v.data.length){
                this.products=v.data;
                this.hasNext = v.has_next;
                const decideScroll = ()=>{
                    const offset = this.productsElem.nativeElement.offsetTop;
                    const height = this.productsElem.nativeElement.clientHeight;
                    if(pageYOffset+500>offset && (height+offset)>pageYOffset && this.products.length){
                         this.disabled = false;
                    }
                }
                decideScroll();
                window.onscroll = decideScroll.bind(this)
            }
            this.checkData();
         });

     }

     showMenu(): void{
        this.dialog.open(this.search, {
            width:"90%",
            height:"400px",
        });
     }

     checkData():void{
        if(!this.products.length){
            this.isEmpty = true;
        } else{
            this.isEmpty = false;
        }
        this.sentHttp = false;
     }

     ngAfterViewInit():void{
         let url = "http://127.0.0.1:8000/api/info-products/";

         if (this.isSearchPage) {
             url += '&search=' + encodeURIComponent(this.searchText);
         }

         this.http.get<ProductsInfo>(url).subscribe(v=>{
              this.categories = v.data.categories;
              this.max_price = v.data.price[1].max_price;
              this.max_price_value = v.data.price[1].max_price;
         })
         this.getBrands({value:""});
         
         const onScroll = () => {
             const func = () => {
                 const width = document.documentElement.clientWidth;

                 if (width < this.MWIDTH) {
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
                     matSearchContainer.classList.remove('shadow-none');
                 });
             };
             setTimeout(func.bind(this), 0);
         };
         
         window.onresize = onScroll.bind(this);
         
         onScroll();
     }

     getBrands($event:{value:string}):void{
        this.activeCategory = $event.value||"";
        
        let url = "http://127.0.0.1:8000/api/getbrands/?category=" + encodeURIComponent(this.activeCategory);

        if (this.isSearchPage) {
             url += '&search=' + encodeURIComponent(this.searchText);
        }

        this.http.get<ProductsBrand>(url)
        .subscribe((v)=>{
                 this.brands = v.data.brands;
        });
     }


     sort(next = false): void{
         this.sentHttp = true;

         this.dialog.closeAll();

         this.dialog.afterAllClosed.subscribe(()=>{
             if (!next) {
                 this.page = 1;
                 this.products = [];
             }
             const config = {
                 params: new HttpParams().set('min', "0")
                     .set("max", this.max_price.toString())
                     .set("category", this.activeCategory || "")
                     .set("brand", this.activeBrand || "")
                     .set("page", String(this.page))
             };
             
             let url = "http://127.0.0.1:8000/api/sort/";

             if (this.isSearchPage) {
                 url += '&search=' + encodeURIComponent(this.searchText);
             }

             this.http.get<IResponse>(url, config).subscribe(v => {
                 this.products.push(...v.data);
                 this.hasNext = v.has_next;
                 console.log(v.data)
                 this.checkData()
             })
         });
     }

     changeBrand($event):void{
        this.activeBrand = $event.value;
     }

     showNext():void{
        this.page=this.page+1;
        this.sort(true);
     }     

     undoSearch(): void{
         this.router.navigateByUrl("/products");
     }
}