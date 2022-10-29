import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Customer } from 'src/app/models/customer';
import { Order } from 'src/app/models/order';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}
  invoiceDate = new Date().toLocaleDateString();
  invoiceNumber: string = this.generateInvoiceId(6);
  customer?: Customer;
  orders: Order[] = [];

  ngOnInit(): void {
    let orderId = this.activatedRoute.snapshot.params['id'];
    if (this.authService.loggedIn()) {
      this.authService.getCurrentCustomer().subscribe((customer) => {
        this.customer = customer;
      });
    }

    this.productService.getOrders(orderId).subscribe((data) => {
      this.orders = data;
    });
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

  generateInvoiceId(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getTotalCost() {
    return this.orders
      .map((t) => t.total)
      .reduce((acc, value) => acc + value, 0);
  }
}
