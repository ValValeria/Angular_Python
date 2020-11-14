import { Component } from "@angular/core";
import { FormControl, ValidatorFn, Validators } from "@angular/forms";
import { FormBuilder, FormGroup } from "@angular/forms";
import { auditTime } from "rxjs/operators";

@Component({
    selector:"auth-page",
    templateUrl:"./AuthPage.component.html",
    styleUrls:["./AuthPage.component.scss"]
})
export class AuthPage{
    isLogin:boolean = true;
    form:FormGroup;
    isValid = false;

    constructor(builder:FormBuilder){
        const opt:[string,ValidatorFn[]] = ["",[Validators.minLength(10),Validators.maxLength(30),Validators.required]];
        this.form = builder.group({
            username:opt,
            password:opt,
            email:["",[Validators.minLength(10),Validators.maxLength(30),Validators.email]]
        })
        this.form.valueChanges.pipe(auditTime(300))
        .subscribe(v=>{
            if(this.form.invalid && this.isLogin){
                 const errors:string[] = Object.keys(this.form.errors||{});
                 if(errors.length==1 && errors.includes("email")){
                    return this.isValid = true;
                 }
                 console.log(this.form.errors)
            }
            this.isValid = false;
        })
    }

    click(bool:boolean):void{
        this.isLogin = bool;
    }

    submit($event):void{
      $event.preventDefault();  
      console.log(this.isValid)
    }
}