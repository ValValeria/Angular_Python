import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({providedIn:"root"})
export class Authenticate implements HttpInterceptor{
  
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
       const req_auth = req.clone({
           headers:new HttpHeaders({
               "Auth":localStorage.getItem("auth")||"{}"
           })
       })
       return next.handle(req_auth)
   }
}