import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public _authService: AuthService
  ) {}
  registerCustomerData: any = {};

  ngOnInit(): void {}

  registerCustomer() {
    // this._authService.registerCustomer(this.registerCustomerData).subscribe(
    //   (res) => {
    //     console.log(res);
    //     localStorage.setItem('token', res.token);
    //     this.router.navigate(['/products']);
    //   },
    //   (err) => {
    //     this.snackBar.open('Invalid username or password', undefined, {
    //       duration: 3000,
    //     });
    //   }
    // );
  }
}
