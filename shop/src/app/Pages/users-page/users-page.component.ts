import { Component, OnInit } from '@angular/core';
import {IAdminUsersResponse} from '../../Interfaces/Interfaces';
import {HttpService} from '../../Services/Http.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  private response: IAdminUsersResponse;
  private page = 1;
  private perPage = 5;

  constructor(private http: HttpService) { }

  ngOnInit(): void {
      this.http.get<IAdminUsersResponse>(`/api/users?page=${this.page}&per_page=${this.perPage}`).subscribe(v => {
         this.response = v;
      });
  }
}
