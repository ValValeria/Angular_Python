import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { IAd, ProductsBrand, ProductsInfo } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';
import { HttpParams } from '@angular/common/http';


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
    max_price: number;
    brands: string[];
    activeCategory:string;
    activeBrand:string;
    page:number = 1;
    hasNext:boolean=false;
    isEmpty: boolean;
    sentHttp:boolean;
    max_price_value: number=4000;

    constructor(private http:Http){
         this.products = [];
         this.categories = [];
     }

     ngOnInit():void{
         this.sentHttp = true;
         this.http.get<IResponse>("http://127.0.0.1:8000/api/products?page="+this.page).subscribe(v=>{
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

     checkData():void{
        if(!this.products.length){
            this.isEmpty = true;
        } else{
            this.isEmpty = false;
        }
        this.sentHttp = false;
     }

     ngAfterViewInit():void{
          this.http.get<ProductsInfo>("http://127.0.0.1:8000/api/products-info/").subscribe(v=>{
              this.categories = v.data.categories;
              this.max_price = v.data.price[1].max_price;
              this.max_price_value = v.data.price[1].max_price;
         })
         this.getBrands({value:""});
     }

     getBrands($event:{value:string}):void{
        this.activeCategory = $event.value||"";
        this.http.get<ProductsBrand>("http://127.0.0.1:8000/api/getbrands/?category="+encodeURIComponent(this.activeCategory)).subscribe((v)=>{
                 this.brands = v.data.brands;
        })
     }


     sort(next:boolean=false):void{
         this.sentHttp = true;
         if(!next){///means the user wants to sort the goods by some criteria
            this.page = 1;
            this.products = [];
         }
         const config={
             params: new HttpParams().set('min',"0")
                                     .set("max",this.max_price.toString())
                                     .set("category",this.activeCategory||"")
                                     .set("brand",this.activeBrand||"")
                                     .set("page",String(this.page))
         }
         this.http.get<IResponse>("http://127.0.0.1:8000/api/sort/",config).subscribe(v=>{
             this.products.push(...v.data);
             this.hasNext = v.has_next;
             console.log(v.data)
             this.checkData()
         })
     }

     changeBrand($event):void{
        this.activeBrand = $event.value;
     }

     showNext():void{
        this.page=this.page+1;
        this.sort(true);
     }     
}