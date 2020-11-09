import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Header } from './Components/Header/Header.component';
import {HttpClientModule} from '@angular/common/http';
import { Http } from './Services/Http.service';



@NgModule({
  declarations: [
    AppComponent,Header
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [Http],
  bootstrap: [AppComponent]
})
export class AppModule { }
