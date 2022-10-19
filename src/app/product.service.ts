import { Injectable } from '@angular/core';
import { Product, ProductsComponent } from './products/products.component';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseURL = 'http://localhost:8080/';

  refreshCartCount = new BehaviorSubject<boolean>(false);

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

  getCartCount(): Observable<Number | null> {
    let customerId = localStorage.getItem('customerId');
    if (customerId)
      return this.http
        .get<any>(this.baseURL + 'cartCount/' + customerId)
        .pipe(map((x) => x.cartCount));
    else return of(null);
  }

  addToCart(product: Product, quantity: number, customerId: number) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify({
      productId: product.productId,
      quantity,
      customerId,
    });
    console.log(body);
    return this.http.post(this.baseURL + 'cart', body, {
      headers: headers,
    });
  }
}
