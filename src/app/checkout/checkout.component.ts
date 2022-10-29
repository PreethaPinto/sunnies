import { Component, OnInit } from '@angular/core';
import { Cart } from '../products/Cart';
import { CartComponent } from '../cart/cart.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {}

  cartItems: Cart[] = [];

  ngOnInit(): void {
    this.productService.getCartItems().subscribe((data) => {
      this.cartItems = data;
    });
    if (this.authService.loggedIn()) {
      this.authService.getCurrentCustomer().subscribe((customer) => {
        this.checkoutForm.patchValue(customer as any);
      });
    }
  }

  displayedColumns: string[] = [
    'imageUrl',
    'productName',
    'productModel',
    'brandName',
    'price',
    'quantity',
    'total',
  ];

  checkoutForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    phone: new FormControl(),
    address: new FormControl<string>('', Validators.required),
    city: new FormControl<string>('', Validators.required),
    state: new FormControl<string>('', Validators.required),
    postCode: new FormControl<number | null>(null, Validators.required),
  });

  checkout() {
    this.productService.checkout(this.cartItems).subscribe((res) => {
      this.cartItems.forEach((cartItem) => {
        this.productService.deleteCart(cartItem.cartId).subscribe(() => {
          this.productService.refreshCartCount.next(true);
        });
      });

      this.router.navigate([`/invoice/${(res as any).orderId}`]);
    });
  }

  getTotalCost() {
    return this.cartItems
      .map((t) => t.total)
      .reduce((acc, value) => acc + value, 0);
  }
}
