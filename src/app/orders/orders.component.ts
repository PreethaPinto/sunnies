import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  constructor(
    private service: ProductService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  displayedColumns: string[] = [
    'orderId',
    'imageUrl',
    'customerName',
    'productName',
    'productModel',
    'brandName',
    'orderDate',
    'price',
    'quantity',
    'total',
  ];

  orders: any[] = [];

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getOrders().subscribe(
      (res) => (this.orders = res),
      (err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      }
    );
  }

  getTotalCost() {
    return this.orders
      .map((t) => t.total)
      .reduce((acc, value) => acc + value, 0);
  }
}
