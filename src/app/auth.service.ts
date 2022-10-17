import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loginUrl = 'http://localhost:4800/login';

  constructor(private http: HttpClient, private router: Router) {}

  loginAdmin(admin: any) {
    return this.http.post<any>(this._loginUrl, admin);
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

  registerCustomer() {}
  register() {}
}
