import { Injectable } from '@angular/core';
import { Product, ProductsComponent } from './products/products.component';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseURL = 'http://localhost:4200/';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.delete(this.baseURL + 'products/');
  }

  addNewProduct(product: Product) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(product);
    return this.http.post(this.baseURL + 'products', body, {
      headers: headers,
    });
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseURL + 'products/' + id);
  }

  editProduct(product: Product) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(product);
    return this.http.put(this.baseURL + 'products', body, {
      headers: headers,
    });
  }
}
