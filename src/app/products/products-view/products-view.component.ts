import { DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/product.service';
import { Product } from '../Product';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent implements OnInit {
  constructor(
    private service: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  products: Product[] = [];
  singleProduct: any;
  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.params['id'];

    this.service.getProducts([], []).subscribe(
      (res: any) => {
        this.products = res;
        this.products = this.products.filter(
          (product: Product) => product.productId == id
        );
        this.singleProduct = this.products[0];
        console.log(this.singleProduct);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  addToCart(product: Product) {
    this.service
      .addToCart(product, 1)
      .subscribe(() => this.service.refreshCartCount.next(true));
  }
}
