import { Injectable } from '@angular/core';
import { Product, ProductsComponent } from './products/products.component';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseURL = 'http://localhost:4800/';

  constructor(private http: HttpClient) {}

  getProducts(
    products: string[],
    prices: string[],
    isAdmin = false
  ): Observable<Product[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.appendAll({ products: products.toString() });
    queryParams = queryParams.appendAll({ prices: prices.toString() });

    return this.http.get<Product[]>(
      this.baseURL + (isAdmin ? 'products?' : 'customerProducts?') + queryParams
    );
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
