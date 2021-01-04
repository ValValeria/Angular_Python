import { ChangeDetectorRef, Component } from "@angular/core";
import { FormControl, ValidatorFn, Validators } from "@angular/forms";
import { FormBuilder, FormGroup } from "@angular/forms";
import { auditTime } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { User } from "src/app/Services/User.service";
import { merge } from "rxjs";
import { AuthenticateClass } from 'src/app/Classes/Authenticate';

@Component({
    selector: "auth-page",
    templateUrl: "./AuthPage.component.html",
    styleUrls: ["./AuthPage.component.scss"]
})
export class AuthPage {
    isLogin: boolean = true;
    form: FormGroup;
    isValid = false;
    email: FormControl;
    showStatus: string = '';
    message: string;

    constructor(public user: User,
        private builder: FormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
        private detection: ChangeDetectorRef) {

        const opt: [string, ValidatorFn[]] = ["", [Validators.minLength(10), Validators.maxLength(30), Validators.required]];

        this.form = builder.group({
            username: [...opt],
            password: [...opt],
        });

        this.message = "Извините, но что-то случилось. Перезагрузите страницу и попробуйте ещё раз";

        this.email = new FormControl("", {
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
                if (this.form.valid && !this.isLogin) {//signup page
                    this.isValid = this.email.valid;
                }
            })
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.user.is_auth) {
                const duration = 2000;

                this._snackBar.open("Вы уже вошли в систему", "Close", {
                    duration
                });

                setTimeout(() => {
                    this.router.navigateByUrl("/profile");
                }, duration);
            }
        }, 5000)
    }

    click($event): void {
        if ($event.index === 1) {
            this.isLogin = false;
        } else if($event.index === 0){
            this.isLogin = true;
        }
        this.showStatus = '';
        this.detection.detectChanges();
        console.log(this.isLogin);
    }

    submit($event): void {
        $event.preventDefault();

        if (this.isValid) {

            const data: { [prop: string]: string } = { ...this.form.value };

            if (!this.isLogin) {
                Object.assign(data, { email: this.email.value });
            }

            localStorage.setItem("auth", JSON.stringify(data));

            (new AuthenticateClass()).authenticate(this.user, this.isLogin)
                .then(_isSuccess => {
                    if (this.user.is_auth) {
                        this.router.navigateByUrl("/profile");
                    } else {
                        localStorage.removeItem('auth');
                        console.log("error")
                    }
                })
                .catch(v => {
                    if (this.isLogin) {
                        this.showStatus = "Извините, но вас нет в нашей системе"
                    } else {
                        this.showStatus = "Извините, но пользователь с такими данными уже есть в нашей базе"
                    }
                    localStorage.removeItem("auth");
                });
        }
    }
}