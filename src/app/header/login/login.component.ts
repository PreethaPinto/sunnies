import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public _authService: AuthService
  ) {}
  loginAdminData: any = {};

  ngOnInit(): void {}

  loginAdmin() {
    this._authService.loginAdmin(this.loginAdminData).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/products']);
      },
      (err) => {
        this.snackBar.open('Invalid username or password', undefined, {
          duration: 3000,
        });
      }
    );
  }
}
