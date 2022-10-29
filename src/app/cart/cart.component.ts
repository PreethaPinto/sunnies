import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { Cart } from '../products/Cart';
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';
import { ProductsViewComponent } from '../products/products-view/products-view.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private authService:AuthService,
    private router: Router
  ) {}

  displayedColumns: string[] = [
    'imageUrl',
    'productName',
    'productModel',
    'brandName',
    'price',
    'quantity',
    'total',
    'delete',
  ];
  dataSource: any;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.productService.getCartItems().subscribe((data) => {
      this.dataSource = data;
    });
  }

  deleteCart(cart_id: number) {
    this.productService.deleteCart(cart_id).subscribe((cart) => {
      this.refreshList();
      this.productService.refreshCartCount.next(true);
    });
  }

  openCheckoutDialog() {
    if(!this.authService.loggedIn()){
    this.dialog
      .open(CheckoutDialogComponent, { width: '50vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });}
      else
      this.router.navigate(['/checkout']);
  }

  increase(cart:Cart) {
    this.productService.increaseQuantity(cart.productId).subscribe(()=>{
      this.productService.refreshCartCount.next(true);
      this.refreshList();
    });
  }

  decrease(cart:Cart) {
    this.productService.decreaseQuantity(cart.productId).subscribe(()=>{
      this.productService.refreshCartCount.next(true);
      this.refreshList();
    });
  }
}
