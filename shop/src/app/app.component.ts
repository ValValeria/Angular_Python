import { Component, OnInit } from '@angular/core';
import { AuthenticateClass } from './Classes/Authenticate';
import { User } from './Services/User.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'shop';
  
  constructor(private user: User){}

  ngOnInit(): void{
    (new AuthenticateClass()).authenticate(this.user);
  }
}
