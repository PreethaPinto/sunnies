import { Component, OnInit } from '@angular/core';
import { Cart } from '../products/Cart';
import { CartComponent } from '../cart/cart.component';
import { InvoiceDialogComponent } from './invoice-dialog/invoice-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  constructor(private dialog: MatDialog, private service: ProductService) {}

  dataSource: any;

  ngOnInit(): void {
    //   this.refreshList();
    // }
    // refreshList() {
    //   this.service.getCheckoutItems().subscribe((data) => {
    //     this.dataSource = data;
    //   });
    // }
  }

  checkoutForm = new FormGroup({
    deliverAddress: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    emailAddress: new FormControl(),
    phone: new FormControl(),
  });

  openInvoiceDialog() {
    this.dialog
      .open(InvoiceDialogComponent, { width: '50vw' })
      .afterClosed()
      .subscribe(() => {});
  }
}
