import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer } from './models/customer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient, private router: Router) {}

  loginAdmin(admin: any) {
    return this.http.post<any>(this.baseUrl + 'login', admin);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logoutAdmin() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  registerCustomer(customer: Customer): Observable<any> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(customer);
    return this.http.post(this.baseUrl + 'register', body, {
      headers: headers,
    });
  }
  register() {}
}
