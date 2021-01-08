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
import { MatBadgeModule } from '@angular/material/badge';
import { SearchForm } from './Components/SearchForm/SearchForm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AppComponent, Header, SearchForm
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    MatBadgeModule,
    MatDialogModule,
    NgbModule,
  ],
  providers: [Http,
              User,
              { provide: HTTP_INTERCEPTORS, useClass: Authenticate, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
