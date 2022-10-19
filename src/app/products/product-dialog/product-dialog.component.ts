import { Component, Inject, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../products.component';
import { ProductService } from 'src/app/product.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: ProductService,
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) {}

  ngOnInit(): void {}
  productForm = new FormGroup({
    productId: new FormControl(this.product?.productId),
    productName: new FormControl(
      this.product?.productName,
      Validators.required
    ),
    productModel: new FormControl(
      this.product?.productModel,
      Validators.required
    ),
    brandName: new FormControl(this.product?.brandName, Validators.required),
    price: new FormControl(this.product?.price, [
      Validators.required,
      Validators.max(32766),
    ]),

    stockOnHand: new FormControl(this.product?.stockOnHand, [
      Validators.required,
      Validators.max(32766),
    ]),

    imageUrl: new FormControl(this.product?.imageUrl, Validators.required),
  });
  // productForm = new FormGroup({
  //   productName: new FormControl<string>('', Validators.required),
  //   productModel: new FormControl<string>('', Validators.required),
  //   brandName: new FormControl<string>('', Validators.required),
  //   imageUrl: new FormControl<string>('', Validators.required),
  //   price: new FormControl<number | null>(null, Validators.required),
  //   stockOnHand: new FormControl<number | null>(null, Validators.required),
  // });

  addNewProduct() {
    if (this.product)
      this.service
        .editProduct(this.productForm.value as Product)
        .subscribe(() => {
          this.dialog.closeAll();
        });
    else
      this.service
        .addNewProduct(this.productForm.value as Product)
        .subscribe(() => {
          this.dialog.closeAll();
        });
  }
}
