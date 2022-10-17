import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Customer } from 'src/app/models/customer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}
  registerCustomerData: any = {};

  ngOnInit(): void {}


  
  form = new FormGroup({
    firstName: new FormControl<string>('', Validators.required),
    lastName: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>(''),
    address: new FormControl<string>('', Validators.required),
    city: new FormControl<string>('', Validators.required),
    state: new FormControl<string>('', Validators.required),
    postCode: new FormControl<number | null>(null, Validators.required),
  });

  registerCustomer() {
    this.authService.registerCustomer(this.form.getRawValue()).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/products']);
      },
      (err) => {
        this.snackBar.open('Registration Failed', undefined, {
          duration: 3000,
        });
      }
    );
  }
}
