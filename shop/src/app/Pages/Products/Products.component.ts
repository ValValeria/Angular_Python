import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { IAd, ProductsBrand, ProductsInfo } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';
import { HttpParams } from '@angular/common/http';

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
    max_price: number;
    brands: string[];
    activeCategory:string;
    activeBrand:string;

     constructor(private http:Http){
         this.products = [];
         this.categories = [];
     }

     ngOnInit():void{
         this.http.get<IAd[]>("http://127.0.0.1:8000/api/products").subscribe(v=>{
            if((v||[]).length){
                this.products=v;
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
         });
     }

     ngAfterViewInit():void{
          this.http.get<ProductsInfo>("http://127.0.0.1:8000/api/products-info/").subscribe(v=>{
              this.categories = v.data.categories;
              this.max_price = v.data.price[1].max_price;
         })
     }

     getBrands($event:{value:string}):void{
         this.activeCategory = $event.value;
         this.http.get<ProductsBrand>("http://127.0.0.1:8000/api/getbrands/?category="+encodeURIComponent(this.activeCategory)).subscribe((v)=>{
             this.brands = v.data.brands;
         })
     }


     sort():void{
         const config={
             params: new HttpParams().set("sortBy","price")
                                     .set("sortBy","category")
                                     .set("sortBy","brand")
                                     .set('min',"0")
                                     .set("max",this.max_price.toString())
                                     .set("category",this.activeCategory)
                                     .set("brand",this.activeBrand)
         }
         this.http.get<{data:IAd[]}>("http://127.0.0.1:8000/api/sort/",config).subscribe(v=>{
             this.products = v.data;
         })
     }

     changeBrand($event):void{
        this.activeBrand = $event.value;
        console.log(this.activeBrand)
     }
     
}