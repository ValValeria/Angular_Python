import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from "@angular/core";
import { Observable ,of} from 'rxjs';
import {retry,catchError} from 'rxjs/operators'

type POST_DATA=FormData|{email:string,password:string}|string;

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

    /**
     * Returns the observable,which can send a post request
     * @param url 
     * @param formdata 
     * @param config
     * @returns observable<T|{status:string}>
     */
    public post<T>(url:string,formdata:POST_DATA,config?:object):Observable<T|{status:string}>{
     
        const obj = {
            headers: new HttpHeaders().set('Auth',localStorage.getItem('auth')||''),
            ...config
        };
      
        return this.http.post<T>(url,formdata,obj);
    }
}