import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './Pages/HomePage/HomePage.component';
import { CommonModule } from '@angular/common';
import { Products } from './Pages/Products/Products.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


const routes: Routes = [
  {path:"",component:HomePage},
  {path:"products",component:Products}
];

const modules = [MatButtonModule,CommonModule,MatProgressSpinnerModule];

@NgModule({
  imports: [RouterModule.forRoot(routes),...modules],
  declarations:[HomePage,Products],
  exports: [RouterModule,...modules]
})
export class AppRoutingModule { }
