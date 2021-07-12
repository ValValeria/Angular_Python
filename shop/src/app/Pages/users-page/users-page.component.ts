import { Component, OnInit } from '@angular/core';
import {IAdminUsersResponse, IResponse, IUser} from '../../Interfaces/Interfaces';
import {HttpService} from '../../Services/Http.service';
import {UserService} from '../../Services/User.service';
import {PageEvent} from '@angular/material/paginator';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {from} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss'],
})
export class UsersPageComponent implements OnInit {
  public response: IAdminUsersResponse;
  public page = 1;
  public perPage = 5;
  public allPages = 0;
  public allUsers = 0;
  public displayedFields: string[];
  public displayedAllFields: string[];
  private ids: number[] = [];
  public users: IUser[];

  constructor(private http: HttpService,
              private snackBar: MatSnackBar
              ) { }

  ngOnInit(): void {
      this.displayedFields = ['username', 'email', 'role'];
      this.displayedAllFields = ['id', 'avatar',...this.displayedFields, 'orders', 'link'];

      this.makeHttpRequest();
      this.users = [];
  }

  changePage($event: PageEvent): void{
      this.page = $event.pageIndex;
      this.perPage = $event.pageSize;

      this.makeHttpRequest();
  }

  makeHttpRequest(): void{
    this.http.get<IAdminUsersResponse>(`/api/users?page=${this.page}&per_page=${this.perPage}`).subscribe(v => {
      v.data.users = v.data.users.map(v1 => {
        const user = new UserService();
        user.loadUserData(v1);

        return user;
      });

      this.response = v;
      this.users.push(...v.data.users);
      this.allPages = v.data.all_pages;
      this.allUsers = v.data.all_users_count;
    });
  }

  change($event: MatCheckboxChange, id: number): void{
    if ($event.checked){
      this.ids.push(id);
    } else {
      this.ids = this.ids.filter(v => v !== id);
    }
  }

  delete(): void{
    from(this.ids).pipe(mergeMap(v => this.http.get<IResponse>(`/api/delete-user/${v}`)))
      .subscribe(v => {
          this.snackBar.open('The users have been deleted', 'Close');

          setTimeout(() => {
            this.page = 1;
            this.makeHttpRequest();
          }, 700);
      });
  }
}
