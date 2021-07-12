import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/Services/Http.service';
import { UserService } from 'src/app/Services/User.service';

@Component({
    selector: 'app-like',
    templateUrl: './Like.component.html',
    styleUrls: ['./Like.component.scss']
})
export class Like{
    @Input('id') productId: number;
    @Input('user') user: UserService;

    constructor(private http: HttpService,  private _snackBar: MatSnackBar){}

    addLike(): void{
      if (!this.user.is_auth){
           this._snackBar.open('Только авторизированные пользователи могут ставить лайки');
      } else {
          this.http.get<{ status: 'ok', errors: string[]}>('http://127.0.0.1:8000/api/addlike?productId=' + this.productId).subscribe(v => {
               if (v.status === 'ok'){
                   this._snackBar.open('Добавлено в избранные', 'Close', {
                       duration: 5000
                   });
               } else{
                   this._snackBar.open(v.errors[0], 'Close', {
                       duration: 5000
                   });
               }
           });
      }
    }
}
