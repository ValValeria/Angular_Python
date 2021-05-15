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
import { HeaderTop } from './Components/HeaderTop/HeaderTop.component';
import { Avatar } from './Components/Avatar/Avatar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './Components/footer/footer.component';
import { SectionLayoutComponent } from './Layouts/section-layout/section-layout.component';
import { LogoComponent } from './Components/logo/logo.component';


@NgModule({
  declarations: [
    AppComponent, Header, SearchForm,
    HeaderTop, Avatar, FooterComponent, LogoComponent
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
    MatSidenavModule,
    MatIconModule
  ],
  providers: [Http,
    User,
    {provide: HTTP_INTERCEPTORS, useClass: Authenticate, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
