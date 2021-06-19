import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { URL_PATH } from 'src/app/app.component';
import { HttpService } from 'src/app/Services/Http.service';

@Component({
    selector: 'app-contact-page',
    templateUrl: './ContactPage.component.html',
    styleUrls: ['./ContactPage.component.scss'],
    animations: [
        trigger('fade', [
            transition(':enter', query(':self', stagger('100ms', [
                style({ opacity: 0 }),
                animate('1s', style({ opacity: 1 }))
            ])))
        ])
    ]
})
export class ContactPage implements OnInit{
    formGroup: FormGroup;

    constructor(private http: HttpService, private snackBar: MatSnackBar){}

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            email: new FormControl("",[
                Validators.minLength(10),Validators.maxLength(30), Validators.required
            ]),
            cause: new FormControl("", [
                Validators.minLength(10), Validators.maxLength(50)
            ]),
            message: new FormControl("", [
                Validators.minLength(50), Validators.maxLength(300), Validators.required
            ]),
        });
    }

    click(): void{
        if (this.formGroup.valid){
           const data = this.formGroup.value;
           const formdata: FormData = new FormData();

           Object.entries(data).forEach(([key,value]) => {
               formdata.append(key, value.toString());
           });

            this.http.post<{ status: 'ok' }>(`${URL_PATH}api/send-letter`, formdata)
           .subscribe(v => {
               if(v.status === 'ok'){
                   this.snackBar.open('Ваше письмо отправлено', 'Close');
               }
            });
        } else{
            this.snackBar.open('Проверьте правильность введенных данных', 'Close');
        }
    }
}
