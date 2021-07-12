import {AfterViewInit, ChangeDetectorRef, Component} from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { auditTime } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/Services/User.service';
import { merge } from 'rxjs';
import { AuthenticateHelper } from 'src/app/Classes/authenticate-helper.service';

@Component({
    selector: 'app-auth-page',
    templateUrl: './AuthPage.component.html',
    styleUrls: ['./AuthPage.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AuthPage implements AfterViewInit{
    isLogin = true;
    form: FormGroup;
    isValid = false;
    email: FormControl;
    showStatus = '';
    message: string;
    selectedIndex = 0;

    constructor(public user: UserService,
                private builder: FormBuilder,
                private snackBar: MatSnackBar,
                private router: Router,
                private route: ActivatedRoute,
                private authHelper: AuthenticateHelper) {

        const opt: [string, ValidatorFn[]] = ['', [Validators.minLength(10), Validators.maxLength(30), Validators.required]];

        this.form = builder.group({
            username: [...opt],
            password: [...opt],
        });

        this.message = 'Извините, но что-то случилось. Перезагрузите страницу и попробуйте ещё раз';

        this.email = new FormControl('', {
            validators: opt[1].concat(Validators.email)
        });

        merge(
            this.form.valueChanges,
            this.email.valueChanges
        )
            .pipe(
                auditTime(300)
            ).subscribe(v => {
                this.isValid = this.form.valid;
                if (this.form.valid && !this.isLogin) {// signup page
                    this.isValid = this.email.valid;
                }
            });

        this.route.queryParamMap.subscribe(v => {
            const isLogin = v.get('isLogin');

            if (isLogin === 'true') {
                this.isLogin = true;
                this.selectedIndex = 0;
            } else{
                this.isLogin = false;
                this.selectedIndex = 1;
            }
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.user.is_auth) {
                const duration = 2000;

                this.snackBar.open('Вы уже вошли в систему', 'Close', {
                    duration
                });

                setTimeout(async () => {
                    await this.router.navigateByUrl('/profile');
                }, duration);
            }
        }, 5000);
    }

    click($event): void {
        if ($event.index === 1) {
            this.isLogin = false;
            this.selectedIndex = 1;
        } else if ($event.index === 0) {
            this.isLogin = true;
            this.selectedIndex = 0;
        }

        this.showStatus = '';
    }

    submit($event): void {
      $event.preventDefault();

      const data: { [prop: string]: string } = { ...this.form.value };

      if (!this.isLogin) {
        Object.assign(data, { email: this.email.value });
      }


      this.authHelper.authenticate(this.user, this.isLogin)
        .then(async () => {
          if (this.user.is_auth) {
            localStorage.setItem('auth', JSON.stringify(this.user));
            await this.router.navigateByUrl(`/profile/${this.user.id}`);
          } else {
            throw new Error();
          }

          return;
        })
        .catch(v => {
          if (this.isLogin) {
            this.showStatus = 'Извините, но вас нет в нашей системе';
          } else {
            this.showStatus = 'Извините, но пользователь с такими данными уже есть в нашей базе';
          }
          localStorage.removeItem('auth');
        });
     }
}
