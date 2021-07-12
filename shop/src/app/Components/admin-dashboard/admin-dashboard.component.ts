import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {UserService} from '../../Services/User.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent{
  @Output() changeAvatarEvent = new EventEmitter<boolean>();
  @Input() user: UserService;
  @Input() currentUser: UserService;

  constructor(private router: Router) {}

  changeAvatar(): void{
    this.changeAvatarEvent.emit();
  }

  async navigateToUsersPage(): Promise<void>{
    await this.router.navigateByUrl('/profile/users');
  }
}
