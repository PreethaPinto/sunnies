import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

export interface Product {
  product_id?: number;
  product_name: string;
  product_model: string;
  brand_name: string;
  price: number;
  stock_on_hand: number;
  image: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private service: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  displayedColumns: string[] = [
    'product_name',
    'product_model',
    'brand_name',
    'price',
    'stock_on_hand',
    'image',
  ];

  dataSource: any;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getProducts([], [], true).subscribe(
      (res) => (this.dataSource = res),
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  addNewProduct() {
    this.dialog
      .open(ProductDialogComponent, { width: '75vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }

  deleteProduct(product_id: number) {
    this.service.deleteProduct(product_id).subscribe((product) => {
      this.refreshList();
    });
  }

  editProduct(product: Product) {
    this.dialog
      .open(ProductDialogComponent, { data: product, width: '75vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }
}
