import {Component, Input, OnInit} from '@angular/core';
import {IUser} from '../../Interfaces/Interfaces';
import {Router} from '@angular/router';
import {HttpService} from '../../Services/Http.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: IUser;

  constructor(private router: Router,
              private httpService: HttpService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  async visitProfile(): Promise<any>{
    await this.router.navigateByUrl(`/profile/${this.user.id}`);
  }

  async deleteUser(): Promise<any>{
    this.httpService.get(`/api/delete-user/?id=${this.user.id}`).subscribe(v => {
        this.snackBar.open('The user has been deleted.', 'Close');
    });
  }
}
