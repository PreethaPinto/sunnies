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
  constructor(private service: ProductService, private route: ActivatedRoute) {}

  products: Product[] = [];
  singleProduct: any;
  ngOnInit(): void {
    this.service.getProducts([], []).subscribe(
      (res: any) => {
        this.products = res;
        this.products = this.products.filter((data: any) => data.id == 1);
        this.singleProduct = this.products[0];
        console.log(this.singleProduct);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
