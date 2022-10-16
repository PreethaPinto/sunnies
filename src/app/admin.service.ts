import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from './admin/admin.component';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseURL = 'http://localhost:4800/';

  constructor(private http: HttpClient) {}

  getAdmin() {
    return this.http.get(this.baseURL + 'admin');
  }

  addNewAdmin(admin: Admin) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(admin);
    console.log(body);
    return this.http.post(this.baseURL + 'admin', body, {
      headers: headers,
    });
  }

  updateAdmin(admin: Admin) {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(admin);
    console.log(body);
    return this.http.put(this.baseURL + 'admin', body, {
      headers: headers,
    });
  }

  deleteAdmin(id: number) {
    return this.http.delete(this.baseURL + 'admin/' + id);
  }
}
