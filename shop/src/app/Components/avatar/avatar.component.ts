import { Component, Input } from '@angular/core';
import {User} from '../../Services/User.service';
import {URL_PATH} from '../../app.component';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    animations: [
      trigger('fade', [
        transition('enter=>leave', [
          style({ opacity: 0 }),
          animate('1s', style({ opacity: 1 }))
        ]),
        transition('leave=>enter', [
          animate('1s', style({ opacity: 0 }))
        ]),
    ])],
    styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
    @Input() showAuthAvatar = false;
    @Input() showPopup = false;

    constructor(private user: User,
                private http: HttpClient,
                private router: Router) {}

    logout(): void {
       localStorage.removeItem('auth');
       this.user.logout();
       this.router.navigateByUrl('/').catch(() => null);
    }

    deleteProfile(): void {
       this.http.get(`${URL_PATH}api/delete-user`).subscribe(() => {
         this.logout();
       });
    }
}
