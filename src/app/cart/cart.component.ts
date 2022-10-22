import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
//import { AdminService } from '../admin.service';
import { AdminDialogComponent } from '../admin/admin-dialog/admin-dialog.component';
import { ProductService } from '../product.service';
import { Cart } from '../products/Cart';
import { CheckoutDialogComponent } from './checkout-dialog/checkout-dialog.component';

// export interface Admin {
//   adminId: number;
//   firstName: string;
//   lastName: string;
//   adminRole: string;
//   username: string;
//   password: string;
// }

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    //private service: AdminService,
    private productService: ProductService
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
    });
  }

  openCheckoutDialog() {
    this.dialog
      .open(CheckoutDialogComponent, { width: '50vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }

  increase() {}

  decrease() {}

  // editCart(admin: Admin) {
  //   this.dialog
  //     .open(AdminDialogComponent, { data: admin, width: '50vw' })
  //     .afterClosed()
  //     .subscribe((result) => {
  //       this.refreshList();
  //     });
  // }
}
