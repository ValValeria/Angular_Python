import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from "@angular/core";
import { Observable ,of} from 'rxjs';
import {retry,catchError} from 'rxjs/operators'

@Injectable()
export class Http{

    constructor(private http:HttpClient){}

    public get<T>(url:string,config?:{params:HttpParams}):Observable<T|null>{
        const obj = {
            headers: new HttpHeaders().set('Auth',localStorage.getItem('auth')||''),
        };  

        Object.assign(obj,config)

        return this.http.get<T>(url,obj).pipe(
               retry(3),
               catchError((e:any)=>of(null)));
    }

    
    public post<T>(url:string,formdata:FormData|{email:string,password:string}):Observable<T|{status:string}>{
     
        const obj = {
            headers: new HttpHeaders().set('Auth',localStorage.getItem('auth')||''),
        };
      
        return this.http.post<T>(url,formdata,obj);
    }
}