import { Component } from "@angular/core";
import { FormControl, ValidatorFn, Validators } from "@angular/forms";
import { FormBuilder, FormGroup } from "@angular/forms";
import { auditTime } from "rxjs/operators";
import { Http } from '../../Services/Http.service';
import { HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { User } from "src/app/Services/User.service";
import { merge } from "rxjs";
import { IAuthResponse } from "src/app/Interfaces/Interfaces";

@Component({
    selector:"auth-page",
    templateUrl:"./AuthPage.component.html",
    styleUrls:["./AuthPage.component.scss"]
})
export class AuthPage{
    isLogin:boolean = true;
    form:FormGroup;
    isValid = false;
    email:FormControl;
    showStatus:boolean = false;
    message:string;

    constructor(builder:FormBuilder,private user:User,private http:Http,private _snackBar: MatSnackBar,private router:Router){

        const opt:[string,ValidatorFn[]] = ["",[Validators.minLength(10),Validators.maxLength(30),Validators.required]];
       
        this.form = builder.group({
            username:[...opt],
            password:[...opt],
        });

        this.message = "Извините, но что-то случилось. Перезагрузите страницу и попробуйте ещё раз";

        this.email = new FormControl("",{
            validators:opt[1].concat(Validators.email)
        });
        
        merge(
             this.form.valueChanges,
             this.email.valueChanges
        )
        .pipe(
            auditTime(300)
        ).subscribe(v=>{
            this.isValid = this.form.valid;
            if(this.form.valid && !this.isLogin){//signup page
                this.isValid = this.email.valid;
            } 
        })
    }

    click(bool:boolean):void{
        this.isLogin = bool;
        this.showStatus = false;
    }

    submit($event):void{
      $event.preventDefault();  

      if(this.isValid){
        const url = this.isLogin ? "login":"signup";

        const data = {...this.form.value}

        if(this.isLogin){
            Object.assign(data,{email:this.email.value})
        }

        let result:string = '';

        for (const [key,value] of Object.entries(data)) {
            result+=`${key}=${value}&`
        }

        result = result.slice(0,-1);
 
        this.http.post<IAuthResponse>("http://127.0.0.1:8000/api/"+url,result,{
            headers: new HttpHeaders({
                "Content-Type":"application/x-www-form-urlencoded"
            })
        }).
        subscribe(v=>{
            if (v.status=="user"){
                localStorage.setItem("auth",JSON.stringify({...data}))
                this.router.navigateByUrl("/profile")
                this.user.login(data)
            } else{
                if(this.isLogin){
                   this.showStatus = true;
                } else{
                    this._snackBar.open(this.message, "Close", {
                        duration: 10000,
                    });
                }
            }
            console.log(v)
        },(error)=>{
            this._snackBar.open(this.message, "Close", {
                        duration: 10000,
            });
        })
      }
    }
}