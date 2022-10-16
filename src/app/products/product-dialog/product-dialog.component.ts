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
    product_id: new FormControl(this.product?.product_id),
    product_name: new FormControl(
      this.product?.product_name,
      Validators.required
    ),
    product_model: new FormControl(
      this.product?.product_model,
      Validators.required
    ),
    brand_name: new FormControl(this.product?.brand_name, Validators.required),
    price: new FormControl(this.product?.price, Validators.required),

    stock_on_hand: new FormControl(
      this.product?.stock_on_hand,
      Validators.required
    ),

    image: new FormControl(this.product?.image, Validators.required),
  });

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
