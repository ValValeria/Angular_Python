import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild} from '@angular/core';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';

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
     @ViewChild("productsElem",{read:ElementRef})productsElem:ElementRef;

     constructor(private http:Http){
         this.products=[]
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

}