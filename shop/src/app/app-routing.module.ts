import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './Pages/HomePage/HomePage.component';
import { CommonModule } from '@angular/common';
import { Products } from './Pages/Products/Products.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ErrorImageLoading } from './Components/ErrorImageLoading/ErrorImageLoading.component';
import {MatCardModule} from '@angular/material/card';
import { CardSmall } from './Components/CardSmall/CardSmall.component';


const routes: Routes = [
  {path:"",component:HomePage},
  {path:"products",component:Products}
];

const modules = [MatButtonModule,CommonModule,MatProgressSpinnerModule,MatCardModule];

@NgModule({
  imports: [RouterModule.forRoot(routes),...modules],
  declarations:[HomePage,Products,ErrorImageLoading,CardSmall],
  exports: [RouterModule,...modules]
})
export class AppRoutingModule { }
