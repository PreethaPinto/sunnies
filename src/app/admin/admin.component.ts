import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from '../admin.service';
import { AuthService } from '../auth.service';
import { AdminDialogComponent } from './admin-dialog/admin-dialog.component';

export interface Admin {
  adminId: number;
  firstName: string;
  lastName: string;
  adminRole: string;
  username: string;
  password: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private service: AdminService,
    public authService: AuthService
  ) {}

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'adminRole',
    'username',
    'delete',
    'edit',
  ];

  dataSource: any;

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.service.getAdmin().subscribe((data) => {
      this.dataSource = data;
    });
  }

  addNewAdmin() {
    this.dialog
      .open(AdminDialogComponent, { width: '50vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }

  deleteAdmin(adminId: number) {
    this.service.deleteAdmin(adminId).subscribe((admin) => {
      this.refreshList();
    });
  }

  editAdmin(admin: Admin) {
    this.dialog
      .open(AdminDialogComponent, { data: admin, width: '50vw' })
      .afterClosed()
      .subscribe((result) => {
        this.refreshList();
      });
  }
}
