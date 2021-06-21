import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './Components/Header/Header.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { HttpService } from './Services/Http.service';
import { User } from './Services/User.service';
import { Authenticate } from './Services/Authenticate.service';
import { MatBadgeModule } from '@angular/material/badge';
import { SearchForm } from './Components/SearchForm/SearchForm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderTop } from './Components/HeaderTop/HeaderTop.component';
import { AvatarComponent } from './Components/avatar/avatar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FooterComponent } from './Components/footer/footer.component';
import { LogoComponent } from './Components/logo/logo.component';
import {AuthenticateHelper} from './Classes/authenticate-helper.service';

const modules = [
  MatIconModule
];

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, SearchForm,
    HeaderTop, AvatarComponent, FooterComponent, LogoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule,
    MatBadgeModule,
    MatDialogModule,
    NgbModule,
    MatSidenavModule,
    AppRoutingModule,
    ...modules
  ],
  providers: [
    HttpService,
    User,
    AuthenticateHelper,
    {provide: HTTP_INTERCEPTORS, useClass: Authenticate, multi: true},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
