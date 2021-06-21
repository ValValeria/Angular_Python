import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {User} from '../../Services/User.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  @Output() changeAvatarEvent = new EventEmitter<boolean>();

  constructor(public user: User,
              private router: Router
              ) { }

  ngOnInit(): void {
  }

  changeAvatar(): void{
    this.changeAvatarEvent.emit();
  }

  async navigateToUsersPage(): Promise<void>{
    await this.router.navigateByUrl('/profile/users');
  }
}
