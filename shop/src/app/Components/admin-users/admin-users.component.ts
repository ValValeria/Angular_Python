import { Component, OnInit } from '@angular/core';
import {User} from '../../Services/User.service';
import {HttpService} from '../../Services/Http.service';
import {IAdminUsersResponse} from '../../Interfaces/Interfaces';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  private data: IAdminUsersResponse;

  constructor(private user: User,
              private http: HttpService
              ) {}

  ngOnInit(): void {
    this.http.get<IAdminUsersResponse>('/api/users', {})
      .subscribe(v => {
          this.data = v;
      });
  }
}
