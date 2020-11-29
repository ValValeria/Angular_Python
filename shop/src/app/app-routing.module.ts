import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './Pages/HomePage/HomePage.component';
import { CommonModule } from '@angular/common';
import { Products } from './Pages/Products/Products.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ErrorImageLoading } from './Components/ErrorImageLoading/ErrorImageLoading.component';
import {MatCardModule} from '@angular/material/card';
import { CardSmall } from './Components/CardSmall/CardSmall.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { Product } from './Pages/Product/Product.component';
import { Charactarictics } from './Components/Charactarictics/Charactarictics.component';
import { Comments } from './Components/Comments/Comments.component';
import { AuthPage } from './Pages/AuthPage/AuthPage.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AdminPage } from './Pages/AdminPage/AdminPage.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { OrderList } from './Components/OrderList/OrderList.component';
import { ChartsModule } from 'ng2-charts';
import { SafePipe } from './Pipes/Safe.pipe';
import { OrdersLikes } from './Components/OrdersLikes/OrdersLikes.component';


const routes: Routes = [
  { path: "", component: HomePage, pathMatch: "full"},
  {path:"products",component:Products},
  {path:"product/:id",component:Product},
  {path:"authenticate",component:AuthPage},
  {path:"profile",component:AdminPage},
];

const modules = [MatButtonModule,
                 CommonModule,
                 MatProgressSpinnerModule,
                 MatCardModule,
                 ReactiveFormsModule,
                 MatFormFieldModule,
                 FormsModule,
                 MatSliderModule,
                 MatInputModule,
                 MatSelectModule,
                 MatExpansionModule,
                 MatSnackBarModule,
                 MatDividerModule,
                 MatTabsModule,
                 MatSortModule,
                 MatTableModule,
                 ChartsModule,
                 MatCheckboxModule
                ];

@NgModule({
  imports: [RouterModule.forRoot(routes), ...modules],
  declarations:[HomePage,
                Products,
                ErrorImageLoading,
                CardSmall,
                SafePipe,
                OrdersLikes,
                Product,
                Charactarictics,
                Comments,
                AuthPage,
                AdminPage,
                OrderList
                ],
  exports: [RouterModule,...modules]
})
export class AppRoutingModule { }
