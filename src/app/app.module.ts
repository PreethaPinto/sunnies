import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProductsComponent } from './products/products.component';
import { MatCardModule } from '@angular/material/card';
import { ProductDialogComponent } from './products/product-dialog/product-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './header/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDialogComponent } from './admin/admin-dialog/admin-dialog.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RegisterComponent } from './header/register/register.component';
import { CartComponent } from './cart/cart.component';
import { ProductsViewComponent } from './products/products-view/products-view.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { CheckoutDialogComponent } from './cart/checkout-dialog/checkout-dialog.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './http.interceptor';
import { CheckoutComponent } from './checkout/checkout.component';
import { InvoiceDialogComponent } from './checkout/invoice-dialog/invoice-dialog.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    ProductDialogComponent,
    HeaderComponent,
    LoginComponent,
    AdminComponent,
    AdminDialogComponent,
    RegisterComponent,
    CartComponent,
    ProductsViewComponent,
    CheckoutDialogComponent,
    CheckoutComponent,
    InvoiceDialogComponent,
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatBadgeModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    FormsModule,
    MatTableModule,
    MatIconModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
