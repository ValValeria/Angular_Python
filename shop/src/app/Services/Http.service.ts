import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Injectable} from "@angular/core";
import { Observable, of} from 'rxjs';
import {retry,catchError} from 'rxjs/operators';

type POST_DATA = FormData|{email: string, password: string}|string|{message: string, rating: number,post_id:number};

@Injectable()
export class Http{

    constructor(private http:HttpClient){}

    public get<T>(url:string,config?:{params:HttpParams}):Observable<T|null>{
        return this.http.get<T>(url,config).pipe(
               retry(3),
               catchError((e:any)=>of(null)));
    }

    /**
     * Returns the observable,which can send a post request
     * @param url 
     * @param formdata 
     * @param config
     * @returns Observable<T|{status:string}>
     */
    public post<T>(url: string, data: POST_DATA, config: {headers?: HttpHeaders} = {}): Observable<T|{status:string}>{      
        return this.http.post<T>(url, data, config);
    }
}