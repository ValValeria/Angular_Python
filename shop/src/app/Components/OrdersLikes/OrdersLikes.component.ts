import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IAd } from 'src/app/Interfaces/Interfaces';
import { Http } from 'src/app/Services/Http.service';
import { User } from 'src/app/Services/User.service';

export const LIKES$ = new Subject<number>();

@Component({
    selector: 'app-likes',
    templateUrl: './OrdersLikes.component.html'
})
export class OrdersLikes implements OnInit{
    likes: IAd[];
    
    constructor(private http: Http, private user: User){
        this.likes = [];
    }

    ngOnInit(): void{
        this.http.get<{ data: { likes: IAd[]}}>("http://127.0.0.1:8000/api/getlikes?user_id="+this.user.id)
                  .subscribe(v => {
                      this.likes = v.data.likes;
                      this.user.likes = this.likes;
                  });
    }

    selectItems($event): void{
       LIKES$.next($event);
    }
}