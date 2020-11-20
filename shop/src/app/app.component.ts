import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { IAuthResponse } from './Interfaces/Interfaces';
import { User } from './Services/User.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shop';
  
  constructor(private user:User){}

  ngOnInit():void{
        try{
          let data = JSON.parse(localStorage.getItem('auth'));
          let result:string = '';

          for (const [key,value] of Object.entries(data)) {
              result+=`${key}=${value}&`
          }

          let http = new XMLHttpRequest();

          http.responseType="json"

          http.open("POST","http://127.0.0.1:8000/api/login")
          
          http.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");

          http.send(result.slice(0,-1))

          http.onload = ()=>{
             if(http.status==200){
                const response:IAuthResponse = http.response;
                
                if(response.status=="user"){
                   this.user.login(data);
                } else{
                   throw new Error();
                }            
             }
          }
        } catch (e){
          localStorage.removeItem("auth")
        }   
  }
}
