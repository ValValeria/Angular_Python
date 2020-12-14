import { Component, OnInit } from '@angular/core';
import { AuthenticateClass } from './Classes/Authenticate';
import { User } from './Services/User.service';

export const URL_PATH = 'http://127.0.0.1:8000/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'shop';
  
  constructor(private user: User){}

  ngOnInit(): void{
    (new AuthenticateClass()).authenticate(this.user,true).catch(e=>console.log('Status:guest'));
  }
}
