import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Header } from './Components/Header/Header.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { Http } from './Services/Http.service';
import { User } from './Services/User.service';
import { Authenticate } from './Services/Authenticate.service';
import { SafePipe } from './Pipes/Safe.pipe';



@NgModule({
  declarations: [
    AppComponent, Header
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [Http,
              User,
              { provide: HTTP_INTERCEPTORS, useClass: Authenticate, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
