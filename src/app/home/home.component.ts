import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../products/Product';
import { FormGroup, FormControl } from '@angular/forms';
//import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { Router } from '@angular/router';

export interface Customer {
  //order_id?: number;
  first_name: string;
  last_name: string;
  phone_number?: number;
  street_address: string;
  postcode?: number;
  city: string;
  state: string;
  quantity?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'customer_id',
    'first_name',
    'last_name',
    'phone_number',
    'street_address',
    'postcode',
    'city',
    'state',
    'quantity',
  ];
  dataSource: any;

  products: Product[] = [];
  brands: string[] = [];
  prices: Price[] = [
    { value: '<500', label: 'Less than $500' },
    { value: '500-1000', label: '500 - 1000' },
    { value: '>1000', label: 'More than 1000' },
  ];
  constructor(
    public dialog: MatDialog,
    private service: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.getProducts([], []).subscribe((data) => {
      this.products = data;
      this.brands = [...new Set(this.products.map((x) => x.productName))];
    });
    this.brandForm.controls.brandNames.valueChanges
      .pipe(filter(Boolean))
      .subscribe((brandNames) => {
        this.service.getProducts(brandNames, []).subscribe((data) => {
          this.products = data;
        });
      });
    this.brandForm.controls.price.valueChanges
      .pipe(filter(Boolean))
      .subscribe((price) => {
        this.service.getProducts([], price).subscribe((data) => {
          this.products = data;
        });
      });
  }
  buyNow() {}
  addToCart(product: Product) {
    this.service
      .addToCart(product, 1)
      .subscribe(() => this.service.refreshCartCount.next(true));
  }

  brandForm = new FormGroup({
    brandNames: new FormControl<string[]>([]),
    price: new FormControl<string[]>([]),
  });

  navigate() {
    this.router.navigate(['/products-view']);
  }

  // orderProduct(product: Product) {
  //   this.dialog
  //     .open(OrderDialogComponent, { data: product, width: '50vw' })
  //     .afterClosed()
  //     .subscribe();
  // }
}

export interface Price {
  label: string;
  value: string;
}
