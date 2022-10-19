import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  HostBinding,
  HostListener,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    public _authService: AuthService,
    private service: ProductService
  ) {}

  cartCount: number = 0;

  ngOnInit(): void {
    this.service.refreshCartCount
      .pipe(
        switchMap(() => {
          return this.service.getCartCount();
        })
      )
      .subscribe((res) => {
        this.cartCount = Number(res);
      });
  }

  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
