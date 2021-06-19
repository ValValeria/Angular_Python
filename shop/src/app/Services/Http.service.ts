import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable, of} from 'rxjs';
import {retry, catchError} from 'rxjs/operators';

type POST_DATA = FormData|{email: string, password: string}|string|{message: string, rating: number, post_id: number};

@Injectable()
export class HttpService {
    constructor(private http: HttpClient){}

    public get<T>(url: string, config: any= {}): Observable<T>{
        return this.http.get<T>(url, config).pipe(
               retry(3),
               catchError((e: any) => of(e)));
    }

    public post<T>(url: string, data: POST_DATA, config: {headers?: HttpHeaders} = {}): Observable<T|{status: string}>{
        return this.http.post<T>(url, data, config);
    }
}
