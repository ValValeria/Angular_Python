import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Http } from './Services/Http.service';
import { User } from './Services/User.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shop';
  
  constructor(private http:Http,private user:User){}

  ngOnInit():void{
        let auth = localStorage.getItem('auth');

        if(!auth.length) return ;

        let data = JSON.parse(auth)    

        let result:string = '';

        for (const [key,value] of Object.entries(data)) {
            result+=`${key}=${value}&`
        }

        result = result.slice(0,-1);

        this.http.post<{status:string,id:number}>("http://127.0.0.1:8000/api/login",result,{
            headers: new HttpHeaders({
                "Content-Type":"application/x-www-form-urlencoded"
            })
        }).
        subscribe(v=>{
            if (v.status=="user"){
                const data = JSON.parse(localStorage.getItem('auth'))
                this.user.login(data)
            }
            console.log(v)
          })
  }
}
