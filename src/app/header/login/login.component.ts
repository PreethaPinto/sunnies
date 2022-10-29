import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public _authService: AuthService,
    private route: ActivatedRoute
  ) {}
  loginAdminData: any = { isAdminLogin: false };

  loginAdmin() {
    this._authService
      .loginAdmin(this.loginAdminData)
      .pipe(
        switchMap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('customerId', res.customerId);
          localStorage.setItem('isAdmin', this.loginAdminData?.isAdminLogin);
          localStorage.setItem('adminRole', res.role);
          return this.route.queryParams;
        })
      )
      .subscribe(
        (params) => {
          let returnUrl = params['returnUrl'];
          if (returnUrl) this.router.navigate([`/${returnUrl}`]);
          else this.router.navigate(['/products']);
        },
        (err) => {
          this.snackBar.open('Invalid username or password', undefined, {
            duration: 3000,
          });
        }
      );
  }
}
