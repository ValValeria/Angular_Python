import { Component, OnInit } from '@angular/core';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';

@Component({
    selector:'app-likes',
    templateUrl:'./OrdersLikes.component.html'
})
export class OrdersLikes implements OnInit{
    constructor(private http:Http, private user:User){}

    ngOnInit(): void{
        this.http.get<{data:IAd[]}>("http://127.0.0.1:8000/api/getlikes?user_id="+this.user.id)
                  .subscribe(v => {
                      console.log(v);
                  })
    }
}