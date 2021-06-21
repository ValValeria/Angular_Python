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
import { AdminPageComponent } from './Pages/admin-page/admin-page.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { OrderList } from './Components/OrderList/OrderList.component';
import { ChartsModule } from 'ng2-charts';
import { SafePipe } from './Pipes/Safe.pipe';
import { OrdersLikes } from './Components/OrdersLikes/OrdersLikes.component';
import { Like } from './Components/Like/Like.component';
import { MatIconModule } from '@angular/material/icon';
import { ContactPage } from './Pages/ContactPage/ContactPage.component';
import { SearchPageResult } from './Pages/SearchPageResult/SearchPageResult.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { PurchasePage } from './Pages/PurchasePage/PurchasePage.component';
import { CategoryPage } from './Pages/CategoryPage/CategoryPage.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProductPageImage } from './Components/ProductPageImage/ProductPageImage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NotFoundPage } from './Pages/NotFoundPage/NotFoundPage.component';
import { Slider } from './Components/Slider/Slider.component';
import { Carousel } from './Components/Carousel/Carousel.component';
import { BreadCrumbsComponent } from './Components/bread_crumbs/bread_crumbs.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ProductNavigation } from './Components/ProductNavigation/ProductNavigation.component';
import { MatStepperModule } from '@angular/material/stepper';
import {GridLayoutModule} from './Layouts/grid-layout/GridLayout.module';
import {CategoriesListComponent} from './Components/CategoriesList/CategoriesList.component';
import { FlexLayoutComponent } from './Layouts/flex-layout/FlexLayout.component';
import { ProductsCategoriesComponent } from './Components/products-categories/products-categories.component';
import {ServiceInfoPageComponent} from './Pages/service-info-page/service-info-page.component';
import { ListsComponent } from './Components/lists/lists.component';
import {SectionLayoutComponent} from './Layouts/section-layout/section-layout.component';
import {DeliveryPageComponent} from './Pages/delivery-page/delivery-page.component';
import {WarrantyPolicyPageComponent} from './Pages/warranty-policy-page/warranty-policy-page.component';
import { ContactsInfoPageComponent } from './Pages/contacts-info-page/contacts-info-page.component';
import {ContractInfoPageComponent} from './Pages/contract-info-page/contract-info-page.component';
import {SliceStringPipe} from './Pipes/SliceString.pipe';
import {AdminGuard} from './guards/admin.guard';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard.component';
import { AdminDashboardFullComponent } from './Components/admin-dashboard-full/admin-dashboard-full.component';
import {AdminUsersComponent} from './Components/admin-users/admin-users.component';
import { UsersPageComponent } from './Pages/users-page/users-page.component';
import { UserCardComponent } from './Components/user-card/user-card.component';
import {MatListModule} from '@angular/material/list';


const routes: Routes = [
  {path: '', component: HomePage, pathMatch: 'full'},
  {path: 'buy-orders', component: PurchasePage},
  {path: 'products', component: Products },
  {path: 'product/:id', component: Product},
  {path: 'authenticate', component: AuthPage},
  {path: 'profile', component: AdminPageComponent, canActivate: [AdminGuard]},
  {path: 'profile/users', component: UsersPageComponent, canActivate: [AdminGuard]},
  {path: 'search', component: SearchPageResult },
  {path: 'contacts', component: ContactPage},
  {path: 'category/:category', component: CategoryPage},
  {path: 'info/refund', component: ServiceInfoPageComponent},
  {path: 'info/delivery', component: DeliveryPageComponent},
  {path: 'info/warranty', component: WarrantyPolicyPageComponent},
  {path: 'info/contacts', component: ContactsInfoPageComponent},
  {path: 'info/contract', component: ContractInfoPageComponent},
  {path: '**', component: NotFoundPage}
];


const modules = [MatButtonModule, CommonModule,
                 MatProgressSpinnerModule, MatCardModule,
                 ReactiveFormsModule, MatFormFieldModule,
                 MatIconModule, FormsModule,
                 MatSliderModule, MatSidenavModule,
                 MatInputModule, MatSelectModule,
                 MatSlideToggleModule, MatStepperModule,
                 MatExpansionModule, MatSnackBarModule,
                 MatDividerModule, MatTabsModule,
                 MatSortModule, MatTableModule,
                 ChartsModule, MatCheckboxModule,
                 MatChipsModule, MatProgressBarModule,
                 MatDialogModule, GridLayoutModule,
                 MatListModule
                ];

@NgModule({
  imports: [RouterModule.forRoot(routes), ...modules],
  declarations: [HomePage, Products,
                ErrorImageLoading, CardSmall,
                SafePipe, OrdersLikes,
                Product, Carousel,
                Charactarictics, Comments,
                AuthPage, AdminPageComponent,
                Slider, CategoriesListComponent,
                OrderList, Like,
                NotFoundPage, ContactPage,
                ProductPageImage, SearchPageResult,
                PurchasePage, CategoryPage,
                BreadCrumbsComponent, ProductNavigation,
                FlexLayoutComponent, ProductsCategoriesComponent,
                ServiceInfoPageComponent, ListsComponent,
                SectionLayoutComponent, DeliveryPageComponent,
                WarrantyPolicyPageComponent, ContactsInfoPageComponent,
                ContractInfoPageComponent, SliceStringPipe,
                AdminDashboardComponent, AdminDashboardFullComponent,
                AdminUsersComponent, UsersPageComponent, UserCardComponent
                ],
  providers: [AdminGuard],
  exports: [RouterModule, ...modules, ProductsCategoriesComponent, SectionLayoutComponent, AdminDashboardComponent]
})
export class AppRoutingModule { }
