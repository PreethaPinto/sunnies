import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './header/login/login.component';
import { CartComponent } from './cart/cart.component';
import { AuthGuard } from './auth.guard';
import { RegisterComponent } from './header/register/register.component';
import { ProductsViewComponent } from './products/products-view/products-view.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { InvoiceComponent } from './checkout/invoice/invoice.component';
import { OrdersComponent } from './orders/orders.component';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'products-view/:id', component: ProductsViewComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'invoice/:id', component: InvoiceComponent },
  { path: 'orders', component: OrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
