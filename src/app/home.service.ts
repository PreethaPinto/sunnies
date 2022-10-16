import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from './home/home.component';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private baseURL = 'http://localhost:4200/';
  constructor(private http: HttpClient) {}

  orderProduct(customer: Customer) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(customer);
    console.log(body);
    return this.http.post(this.baseURL + 'customers', body, {
      headers: headers,
    });
  }
}
